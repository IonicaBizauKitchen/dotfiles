fpath+=("/usr/local/share/zsh/site-functions")
autoload -Uz promptinit && promptinit
prompt pure

# PATH
export PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH
export PATH=$PATH:/Applications/Postgres.app/Contents/Versions/9.4/bin

# allow locally installed npm binaries to be executed
export PATH="$PATH:./node_modules/.bin"

# Ruby
source ~/.rvm/scripts/rvm

# History
export HISTSIZE=10000
export HISTFILESIZE=10000
export SAVEHIST=10000
export HISTFILE=$HOME/.history
setopt append_history
export NODE_REPL_HISTORY_FILE=$HOME/.node_repl_history
hist() { history | grep "$*"; }

export EDITOR="atom"

# Getting around
alias ..='cd ..'
alias ...='cd ../../'
alias ....='cd ../../../'
alias la='ls -A1'
alias cp='cp -r'
alias rm=rmtrash
alias h=/usr/local/bin/heroku
alias exot=exit
alias d='cd ~/Desktop'
alias down='cd ~/Downloads'
alias t='npm test'
alias i='npm install'
alias config='edit ~/.zshrc'
alias refresh='source ~/.zshrc; echo ".zshrc sourced"'
alias pull='git pull'
alias push='git push origin HEAD'
alias fpush='git push -f origin HEAD'
alias add='git add'
alias gs='git status'
alias status='git status'
alias st='git status'
alias cont='git rebase --continue'
alias diff='git diff'
alias co='git checkout'
alias c='git checkout'
alias fetch='git fetch'
alias com='git commit'
alias cherry='git cherry-pick'
alias stash='git stash'
alias pop='git stash pop'
alias pr='hub pull-request'
alias master='git checkout master'
alias m='git checkout master'
alias gitx=stree
alias git=hub
alias sub='atom'
alias subl='atom'
alias mate='atom'
alias copy='pbcopy'
alias rdm='rake db:migrate && rake db:test:prepare'

# https://github.com/mroth/lolcommits/wiki/FAQ
export LOLCOMMITS_DELAY=5
lol() {
  open "$HOME/.lolcommits/$(basename $(pwd))"
}

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
  alias_subdirectories ~ ~/personal ~/clients ~/clients/j ~/clients/meadow
}

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
# alias fa=f

in() {
  mdfind \"$*\" -onlyin .
}

# Search the history

edit() {
  dir=$1
  atom ${dir:-.} # default to .
}
alias e=edit

serve() {
  port=$1
  python -m SimpleHTTPServer ${port:=8000}
}

# Git

# commit "fix all the things"
# commit quotes not required if not using apostrophes and suchlike
commit() {
  git add .
  git commit -avm "$*" --allow-empty
}

# undo local commits and unstage files
# uncommit # undoes 1 commit by default
# uncommit 3
uncommit() {
  count=$1
  git reset --soft HEAD~${count:-1}
  git reset
}

track() {
  git checkout --track $1
}

# npm shortcuts

npm() {
  if [ "$1" = "dev" ]; then
    npm run dev
  # elif [ "$1" = "open" ] && [ hash npmwd 2>/dev/null ]; then
  #   shift
  #   npmwd "$@"
  else
    command npm "$@"
  fi
}

# patch fix that bug
patch(){
  npm version patch -m "$*"
  npm publish
  git push origin master --follow-tags
}

# minor add that new backwards-compatible feature
minor(){
  npm version minor -m "$*"
  npm publish
  git push origin master --follow-tags
}

# major break old APIs with new hotness
major(){
  npm version major -m "$*"
  npm publish
  git push origin master --follow-tags
}

deploy() {
  if [ "$1" ]; then
    commit $*
  fi
  git push origin master
  git push heroku master
}

# Type `gd branchname` to list files that differ from current branch
gdiff() {
  git diff --name-status $(git symbolic-ref --short HEAD) $1
}

clone() {
  git clone $1
  cd $(basename $1)
  edit .
}

fork() {
  forks && clone $1
}

# Remove a remote and local git branch
prune() {
  git branch -d $1
  git push origin :$1
}

# List branches in reverse chronological order. http://goo.gl/1EKFx
alias branches="git for-each-ref --count=15 --sort=-committerdate refs/heads/ --format='%(refname:short)'"
alias bb=branches

# https://robots.thoughtbot.com/announcing-pick
# brew install pick
b() {
  git checkout $(branches | pick)
}

# Create a new issue with ghi
# issue() { ghi open -m "$*"; }

repo(){ open "https://github.com/$1" }

source ~/clients/j/josephine/.shell-commands
