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

echo $PROJECT
