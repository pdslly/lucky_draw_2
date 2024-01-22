#!/bin/bash

folder="./src/assets/avatar"

cd "$folder"

for file in *; do
    index=$(($index+1))
    if [[ -f $file ]]; then
        extension="${file##*.}"
        new_name="a_$index.${extension}"
        mv "$file" "$new_name"
    fi
done

echo "File renaming completed."