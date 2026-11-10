#!/bin/bash
# Yollgo 新品全自动抓取、差异比对、独立Catalog生成与线上部署一键脚本
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHON_EXEC="$SCRIPT_DIR/MediaCrawler/.venv/bin/python"

if [ ! -f "$PYTHON_EXEC" ]; then
  PYTHON_EXEC="python3"
fi

"$PYTHON_EXEC" "$SCRIPT_DIR/scripts/auto_sync_yollgo_pipeline.py" "$@"
