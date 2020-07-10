#!/usr/bin/env groovy

pipeline {

  agent any

  environment {
    // Hacky way of setting some convenience global vars in the pipeline - not really
    // intended as shell env vars.
    jenkinsImageTag = "resumake-ci:${env.GIT_COMMIT}"
  }

  stages {

    stage('build') {
      steps {
        sh "docker build --tag ${jenkinsImageTag} -f Dockerfile.ci ."
      }
    }

    stage('test') {
      steps {
        sh "docker run -i ${jenkinsImageTag}"
      }
    }

  }

}
