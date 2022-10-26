#!/bin/bash

echo "Let's do some building!"


function doTheThing() {
  output=$(git pull)
  returnCode=$?
  if [[ $? -ne 0 ]]; then
    echo "git pull maybe returned " $returnCode
    cowsay "Git pull failed y'all"
    exit 1
  fi
  echo "The output from git pull is: " $output

  nothingToDo="Already up to date" # wrap the heart medication in the cheese

  if [[ "$output" =~ $nothingToDo.* ]]; then
    echo "Nothing new to see here..."
    return 0
  fi

  echo "something happened!"

  echo "let's deploy..."
  skaffold run
}

while :
do
  date
  doTheThing
  sleep 30
done
