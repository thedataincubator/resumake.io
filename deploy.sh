# A wrapper script for "gcloud app deploy"

set -e

test $# -eq 1
USAGE="Call $(basename "$0") with \"staging\" or \"production\""
case $1 in
    'production')
        PROJECT='thedataincubator'
        ;;
    'staging')
        PROJECT='thedataincubator-staging'
        ;;
    *)
        echo "$USAGE" 1>&2
        exit 1
        ;;
esac

if test -n "$(git status --short)"
then
    echo 'There are some uncommitted changes!' 1>&2
    exit 1
fi

echo $PROJECT
