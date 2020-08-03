#!/bin/bash
FILE_PATH=$1
TITLE=$2
PUBLISH_DATE=$3
COVER_FILE=$4


if [ -z "$FILE_PATH" ] 
then
  echo "请指定文件地址"
  exit 1
fi

if [ -z "$TITLE" ] 
then
  echo "请输入标题"
  exit 1
fi

if [ -z "$PUBLISH_DATE" ] 
then
  echo "请输入发布时间"
  exit 1
fi

if [ -z "$COVER_FILE" ]
then 
  echo "请指定文章封面图片路径"
  exit 1
fi



TARGET_FOLDER="content/blog/$PUBLISH_DATE-$TITLE"

echo $TARGET_FOLDER
mkdir -p $TARGET_FOLDER

CHINESE_TITLE=$(basename $FILE_PATH .md)

COVER_EXTENSION=$(echo $COVER_FILE| awk -F . '{print $NF}')

TARGET_COVER_FILE="$TARGET_FOLDER/cover.$COVER_EXTENSION"
cp $COVER_FILE $TARGET_COVER_FILE 

echo "--- 
title: '$CHINESE_TITLE' 
date: '$PUBLISH_DATE'
cover: './cover.$COVER_EXTENSION'
--- 
" | cat - $FILE_PATH > "$TARGET_FOLDER/index.md"  


