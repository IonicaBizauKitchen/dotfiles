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

# allow executing npm binaries installed into the .bin local and isolated current ./node_modules
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
alias code='cd ~/code'
alias rm=rmtrash
alias h=/usr/local/bin/heroku
alias exot=exit

dir() {
  mkdir -p $1
  cd $1
}

# Create `cd foo` aliases for immediate subdirectories
# of the given directory (or directories).
#
# Usage:
# alias_subdirectories ~/code ~/code/hero ~/code/personal
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
    ~/code \
    ~/code/app-json \
    ~/code/hero \
    ~/code/n \
    ~/code/personal
}

# Allows me to cd into projects
# cdpath=(. ~/code/ ~/code/hero ~/code/personal ~/code/forks ~/support)
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

# Open my node notes for today
# note() {
#   edit ~/code/hero/node-team/notes/`date +"%Y-%m-%d-%a.md" | tr '[A-Z]' '[a-z]'`
# }
# alias notes=note

# Find all non-hidden files in the current path
ff() { find . -iname '*'$*'*' -type f ! -iname ".*"; }

# Find all non-hidden directories in the current path
fd() { find . -iname '*'$*'*' -type d ! -iname ".*"; }

# Find all files and directories in the current path
fa() { find . -iname '*'$*'*' ; }

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

commit() {
  git add .
  git commit -avm "$*" --allow-empty
}

deploy() {
  if [ "$1" ]; then
    commit $*
  fi
  git push origin master
  git push heroku master
}

alias pull='git pull --rebase'
alias push='git push'
alias gs='git status'
alias status='git status'

# clone() {
#   git clone $1
#   cd $(basename $1)
#   edit .
# }

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
issue() { ghi open --claim -m "$*"; }
