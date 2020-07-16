# A wrapper script for "gcloud app deploy"

set -e

function usage_and_exit_1 {
    echo "Call $(basename "$0") with one argument: \"staging\" or \"production\"" 1>&2
    exit 1
}

if test $# -ne 1
then
    usage_and_exit_1
fi

case $1 in
    'production')
        PROJECT='thedataincubator'
        ;;
    'staging')
        PROJECT='thedataincubator-staging'
        ;;
    *)
        usage_and_exit_1
        ;;
esac

if test -n "$(git status --short)"
then
    echo 'There are some uncommitted changes!' 1>&2
    exit 1
fi

echo $PROJECT
