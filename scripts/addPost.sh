#!/bin/bash
FILE_PATH=$1
TITLE=$2
PUBLISH_DATE=$3

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

TARGET_FOLDER="content/blog/$PUBLISH_DATE-$TITLE"

echo $TARGET_FOLDER
mkdir -p $TARGET_FOLDER

# cp $FILE_PATH "$TARGET_FOLDER/index.md" 

echo "--- 
title: '$TITLE' 
date: '$PUBLISH_DATE'
--- 
" | cat - $FILE_PATH > "$TARGET_FOLDER/index.md"  


