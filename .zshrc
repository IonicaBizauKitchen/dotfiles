autoload colors; colors;
export LSCOLORS="Gxfxcxdxbxegedabagacad"
setopt prompt_subst
setopt append_history # append history list to the history file

# prompt
ZSH_THEME_GIT_PROMPT_PREFIX=" %{$reset_color%}%{$fg[cyan]%}"
ZSH_THEME_GIT_PROMPT_SUFFIX="%{$reset_color%}"
ZSH_THEME_GIT_PROMPT_DIRTY="%{$fg[red]%}*%{$reset_color%}"
ZSH_THEME_GIT_PROMPT_CLEAN=""

# show git branch/tag, or name-rev if on detached head
parse_git_branch() {
  (command git symbolic-ref -q HEAD || command git name-rev --name-only --no-undefined --always HEAD) 2>/dev/null
}

# show red star if there are uncommitted changes
parse_git_dirty() {
  if command git diff-index --quiet HEAD 2> /dev/null; then
    echo "$ZSH_THEME_GIT_PROMPT_CLEAN"
  else
    echo "$ZSH_THEME_GIT_PROMPT_DIRTY"
  fi
}

# if in a git repo, show dirty indicator + git branch
git_custom_status() {
  local git_where="$(parse_git_branch)"
  [ -n "$git_where" ] && echo "$(parse_git_dirty)$ZSH_THEME_GIT_PROMPT_PREFIX${git_where#(refs/heads/|tags/)}$ZSH_THEME_GIT_PROMPT_SUFFIX"
}

echo_and_run() {
  echo "\$ $@" ; "$@" ;
}

skeleton() {
  git clone https://github.com/zeke/npm-skeleton $1
  cd $1
  rm -rf ./.git
  echo "FOO=BAR" >> .env
  echo "node_modules" >> .gitignore
  echo ".env" >> .gitignore
  npm install
  npm test
  git init
  git add .
  git commit -am "---=[ npm skeleton ]=---"
}

# basic prompt on the left
PROMPT='
%{$fg[gray]%}%1d% %(?.%{$fg[cyan]%}.%{$fg[red]%})%B$(git_custom_status)%b » '

# PATH
export PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH

# # rbenv
# export PATH=$HOME/.rbenv/bin:$HOME/.rbenv/shims:$PATH
# eval "$(rbenv init -)"

# Postgres
export PATH="/Applications/Postgres.app/Contents/Versions/9.3/bin:$PATH"

export PATH=$HOME/npm/bin:$PATH

alias adminpm="npm --userconfig=$HOME/.admin.npmrc"

# allow locally installed npm binaries to be executed
export PATH="$PATH:./node_modules/.bin"

# NVM
source ~/.nvm/nvm.sh

# Keep a long history
export HISTSIZE=10000
export HISTFILESIZE=10000
export SAVEHIST=10000
export HISTFILE=$HOME/.history

# Getting around
alias ..='cd ..'
alias ...='cd ../../'
alias ....='cd ../../../'
alias .....='cd ../../../../'
alias la='ls -A1'
alias cp='cp -r'
alias rm=rmtrash
alias h=/usr/local/bin/heroku
alias exot=exit
alias Desktop='cd ~/Desktop'
alias desk='cd ~/Desktop'
alias D='cd ~/Desktop'
alias d='cd ~/Desktop'
alias v=vagrant

dir() {
  mkdir -p $1
  cd $1
}

# Create `cd foo` aliases for immediate subdirectories
# of the given directory (or directories).
#
# Usage:
# alias_subdirectories ~/n ~/personal
alias_subdirectories() {
  for dir in $(find $* -type d -mindepth 1 -maxdepth 1); do
    base=`basename $dir`
    # echo $dir
    if ! env which -s $base; then
      echo alias "'$base'"="'cd "'"'"$dir"'"'"'"
    fi
    done > ~/.aliases

  # Cache aliases for faster shell boot time
  source ~/.aliases
}

source ~/.aliases

# Update my favorite directories
function zindex {
  alias_subdirectories \
    ~ \
    ~/n \
    ~/personal
}

# Allows me to cd into projects
# cdpath=(. ~/code/ ~/code/hero ~/code/personal)s
# cdpath=~/code/hero
# typeset -gU cdpath
# setopt autocd

my_heroku_email() {
  cat $HOME/.netrc | grep "machine api\.heroku\.com" -C 1 | tail -n 1 | egrep -o "[^ ]+@heroku.com"
}

my_heroku_email_handle() {
  my_heroku_email | awk -F '@' '{print $1}'
}

destroy_temporary_heroku_apps() {
  hk apps | grep $(my_heroku_email) | awk '{print $1}' | grep -E '^[a-z]+-[a-z]+-\d{4}$' | while read app; do echo $app | hk destroy $app; done
}

hurl() {
  curl -n -H "Accept: application/vnd.heroku+json; version=3" https://api.heroku.com/$@
}

git_files_touched_by() {
  git log --no-merges --author="$1" --stat --name-only --pretty=format:"" | sort -u
}

git_files_untouched_by() {
  git log --no-merges --stat --name-only --pretty=format:"" | sort -u > /tmp/all
  git log --no-merges --author="$1" --stat --name-only --pretty=format:"" | sort -u > /tmp/user
  comm -3 /tmp/all /tmp/user
}

# git log --no-merges --stat --name-only --pretty=format:"" | sort -u > audit-all.txt
# git log --no-merges --stat --author="zeke" --name-only --pretty=format:"" | sort -u > audit-zeke.txt
# git log --no-merges --stat --author="rockbot" --name-only --pretty=format:"" | sort -u > audit-rockbot.txt
# comm -3 audit-all.txt audit-zeke.txt > audit-zeke-untouched.txt
# comm -3 audit-all.txt audit-rockbot.txt > audit-rockbot-untouched.txt

# Find all non-hidden files in the current path
ff() { find . -iname '*'$*'*' -type f ! -iname ".*" ! -path "*node_modules*"; }

# Find all non-hidden directories in the current path
fd() { find . -iname '*'$*'*' -type d ! -iname ".*" ! -path "*node_modules*"; }

# Find all files and directories in the current path,
# ignoring hidden files and node_modules
f() { find . -iname '*'$*'*' ! -iname ".*" ! -path "*node_modules*"; }
alias fa=f

in() {
  mdfind \"$*\" -onlyin .
}

# Search the history
hist() { history | grep "$*"; }

# EDITOR
export EDITOR="atom"
alias sub='atom'
alias subl='atom'
alias mate='atom'

edit() {
  dir=$1
  atom ${dir:-.} # default to .
}
alias e=edit

serve() {
  port=$1
  python -m SimpleHTTPServer ${port:=8000}
}

# Dotfile
alias config='edit ~/.zshrc'
alias refresh='source ~/.zshrc; echo ".zshrc sourced"'

# Git

# commit "fix all the things"
# commit quotes not required if not using apostrophes and suchlike
commit() {
  git add .
  git commit -avm "$*" --allow-empty
}

# patch "fix that bug"
patch(){
  npm version patch -m "$*"
  npm publish
  git push
}

# minor "add that new backwards-compatible feature"
minor(){
  npm version minor -m "$*"
  npm publish
  git push
}

# major "break old APIs with new hotness"
major(){
  npm version major -m "$*"
  npm publish
  git push
}

hdeploy() {
  if [ "$1" ]; then
    commit $*
  fi
  git push origin master
  git push heroku master
}

deploy() {
  echo git push origin $(git symbolic-ref --short -q HEAD):deploy-$1 --force
  git push origin $(git symbolic-ref --short -q HEAD):deploy-$1 --force
}

# tail npm servers
# Usage t staging
t(){
  local server=$(ec2tail list-servers | grep $(basename $(pwd)) | grep $1)
  echo "ec2tail -f $server"
  ec2tail -f $server
}


# Type `gd branchname` to list files that differ from current branch
gd() {
  git diff --name-status $(git symbolic-ref --short HEAD) $1
}

alias pull='git pull --rebase'
alias push='git push'
alias gs='git status'
alias cont='git rebase --continue'
alias status='git status'
alias st='git status'
alias diff='git diff'
alias co='git checkout'
alias c='git checkout'
alias com='git commit'
alias cherry='git cherry-pick'
alias stash='git stash'

clone() {
  git clone $1
  cd $(basename $1)
  edit .
}

# Remove a remote and local git branch
prune() {
  git branch -d $1
  git push origin :$1
}

gitx() {
  dir=$1
  open -b net.phere.GitX ${dir:=.} # default to .
}

alias git=hub

# List branches in reverse chronological order..
# http://stackoverflow.com/questions/5188320/how-can-i-get-a-list-of-git-branches-ordered-by-most-recent-commit
alias b="git for-each-ref --count=30 --sort=-committerdate refs/heads/ --format='%(refname:short)'"

# Create a new issue with ghi and assign it to myself
issue() { ghi open -m "$*"; }

repo(){ open "https://github.com/$1" }
