# A wrapper script for "gcloud app deploy"

set -e

function usage_and_exit_1 {
    echo "Call $(basename "$0") with one argument: \"staging\" or \"production\"" 1>&2
    exit 1
}

function check_uncommitted {
    if test -n "$(git status --short)"
    then
        echo 'There are some uncommitted changes. Please commit or stash them first!' 1>&2
        exit 1
    fi
}

function check_production_branch {
    # 1) Check that we're on "newtemplate" branch.
    local master_branch='newtemplate'
    local git_branch=$(git symbolic-ref --short HEAD)
    if test $master_branch != $git_branch
    then
        echo 'You must be on "'$master_branch'" branch to deploy production!' 1>&2
        exit 1
    fi
    # 2) Check that there are no uncommitted changes in the working tree.
    check_uncommitted
    # 3) Check that "newtemplate" and "origin/newtemplate" don't diverge.
    local master_branch_hash="$(git rev-parse $master_branch)"
    local master_branch_origin_hash="$(git rev-parse origin/$master_branch)"
    if test $master_branch_hash != $master_branch_origin_hash
    then
        echo 'Branches "'$master_branch'" and "origin/'$master_branch'" diverge. Push your changes first!' 1>&2
        exit 1
    fi
}

if test $# -ne 1
then
    usage_and_exit_1
fi

case $1 in
    'production')
        echo -e '\033[0;31mDeploying to production!\033[0m'
        check_production_branch
        PROJECT='thedataincubator'
        ;;
    'staging')
        PROJECT='thedataincubator-staging'
        ;;
    *)
        usage_and_exit_1
        ;;
esac

check_uncommitted

gcloud app deploy --project $PROJECT app.yaml 
