#!/usr/bin/env python3
"""Build GitHub Pages publication output with static SEO and approved image optimization.
Not an authentication or embargo system: repository source remains accessible.
"""
import argparse,html,re,shutil,os,sys
from pathlib import Path
from urllib.parse import urljoin
from xml.sax.saxutils import escape
try:
    from PIL import Image
except ImportError:
    Image = None

PAGES=['index.html','about.html','activities.html','members.html','news.html','join.html','faq.html','contact.html','guidelines.html','privacy.html','videos.html','events.html','collabs.html']
ROOT=Path(__file__).resolve().parents[1]
def build(destination,base_url):
    out=Path(destination).resolve();out.mkdir(parents=True,exist_ok=True)
    if out==ROOT:raise ValueError('出力先をソースフォルダと同じにすることはできません。')
    for p in ROOT.glob('*.html'):shutil.copy2(p,out/p.name)
    shutil.copytree(ROOT/'assets',out/'assets',dirs_exist_ok=True)
    (out/'.nojekyll').write_text('')
    # Images referenced by content arrays are rewritten to optimized WebP if actually smaller.
    if Image:
        converted={}
        for folder in ['members','news','videos','events','collabs']:
            target=out/'assets'/folder
            if not target.exists():continue
            for p in list(target.iterdir()):
                if not p.is_file() or p.suffix.lower() not in ('.png','.jpg','.jpeg'):continue
                try:
                    with Image.open(p) as image:
                        if getattr(image,'is_animated',False):continue
                        im=image.convert('RGBA') if ('A' in image.getbands() or 'transparency' in image.info) else image.convert('RGB')
                        if max(im.size)>1920:im.thumbnail((1920,1920),Image.Resampling.LANCZOS)
                        target_webp=p.with_suffix('.webp')
                        if target_webp.exists():continue
                        im.save(target_webp,'WEBP',quality=84,method=6)
                        if target_webp.stat().st_size<p.stat().st_size:
                            old='assets/'+folder+'/'+p.name;new='assets/'+folder+'/'+target_webp.name
                            converted[old]=new;p.unlink()
                        else:target_webp.unlink()
                except Exception as exc:print('Skip image',p,exc,file=sys.stderr)
        for js in (out/'assets').glob('*.js'):
            content=js.read_text(encoding='utf-8');new=content
            for old,replacement in converted.items():new=new.replace(old,replacement)
            if new!=content:js.write_text(new,encoding='utf-8')
    else:print('Pillow not installed: skipping automatic image optimization.',file=sys.stderr)
    base=(base_url or '').strip().rstrip('/')+'/' if base_url else ''
    if base:
        base=base.replace('http://','https://')
        if not base.startswith('https://'):raise ValueError('base-url must be https://...')
        urls=[]
        for page in PAGES:
            if not (out/page).exists():continue
            uri=urljoin(base,page)
            urls.append(uri)
            path=out/page
            source=path.read_text(encoding='utf-8')
            # Canonical and absolute OGP to work on GitHub Pages project subpaths.
            canonical='<link rel="canonical" href="'+html.escape(uri,quote=True)+'"/>'
            source=source.replace('</head>',canonical+'</head>',1)
            ogimage=urljoin(base,'assets/live-craft-logo.jpg')
            source=re.sub(r'(<meta\s+content=")[^"]*("\s+property="og:image"\s*/>)',lambda m:m.group(1)+html.escape(ogimage,quote=True)+m.group(2),source)
            if page=='index.html':
                import json
                schema={'@context':'https://schema.org','@type':'Organization','name':'Live Craft','url':base,'description':'配信者同士が学び合う自主参加型コミュニティ','logo':urljoin(base,'assets/lc-mark.webp')}
                source=source.replace('</head>','<script type="application/ld+json">'+json.dumps(schema,ensure_ascii=False)+'</script></head>',1)
            path.write_text(source,encoding='utf-8')
        (out/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+''.join('  <url><loc>'+escape(u)+'</loc></url>\n' for u in urls)+'</urlset>\n',encoding='utf-8')
        (out/'robots.txt').write_text('User-agent: *\nAllow: /\nSitemap: '+urljoin(base,'sitemap.xml')+'\n',encoding='utf-8')
    else:
        print('No base-url configured: canonical, sitemap and robots will be skipped.',file=sys.stderr)
    print('Built',out,'for',base or '(local preview)')
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--output',default='_site');p.add_argument('--base-url',default=os.environ.get('PAGES_BASE_URL',''));args=p.parse_args();build(args.output,args.base_url)
