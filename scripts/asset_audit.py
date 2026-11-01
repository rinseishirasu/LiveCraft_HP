#!/usr/bin/env python3
"""Read-only image scan: size, decode, and nested assets/members path handling."""
import argparse
from pathlib import Path
try:
    from PIL import Image
except ImportError:
    Image = None
ROOT = Path(__file__).resolve().parents[1]
EXT = {'.png','.jpg','.jpeg','.webp','.avif','.gif'}

def inspect(root=ROOT):
    files=list((root/'assets').rglob('*'))
    images=[f for f in files if f.is_file() and f.suffix.lower() in EXT]
    warnings=[]
    for p in images:
        rel=p.relative_to(root).as_posix()
        size=p.stat().st_size
        if size>5*1024*1024:warnings.append(f'{rel}: 5MiBを超える画像です（{size//1024}KiB）')
        if Image is not None:
            try:
                with Image.open(p) as im:
                    im.verify()
                with Image.open(p) as im:
                    if max(im.size)>3500:warnings.append(f'{rel}: 最大辺{max(im.size)}px、縮小を推奨')
            except Exception as exc:warnings.append(f'{rel}: 読み込みエラー {exc}')
    return len(images),warnings

def make_report(root=ROOT):
    count,warnings=inspect(root)
    return f'# Live Craft 画像品質チェック\n\n- 検出画像: {count}件（サブフォルダーも含む）\n- 注意点: {len(warnings)}件\n\n'+('\n'.join('- '+w for w in warnings) if warnings else '問題は検出されませんでした')+'\n\n原本は変更していません。公開用ビルドでは必要に応じて最適化します。\n'

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--output',default='');args=parser.parse_args()
    report=make_report()
    if args.output:
        out=Path(args.output);out.parent.mkdir(parents=True,exist_ok=True);out.write_text(report,encoding='utf-8')
    print(report)
