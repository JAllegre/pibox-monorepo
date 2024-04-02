

#!/bin/bash



subfolders=$(find . -type d)
# Loop through each subdirectory
for folder in $subfolders; do
  if [ -d "$folder/.git" ]; then
    cd "$folder"
    echo -e "\e[34m--- $folder -------------------\e[0m"
    case $1 in
      "pull")
        git pull
      ;;
      "push")
        git push
      ;;
      *)
        git fetch -q
        git log HEAD..origin --pretty='format: %C(red)REMOTE%C(reset) %s'
        git status -s
    ;;
    esac

    cd ..
    echo ""
  fi
done

