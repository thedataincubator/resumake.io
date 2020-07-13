#!/usr/bin/env groovy
@Library('jenkins-infra@0.0.3') _ // from https://github.com/thedataincubator/jenkins-infra

def dockerImageName = 'resumake-ci'

pipeline {

  // NOTE: for now we're simply issuing docker commands manually - I had trouble
  // using docker agent with parallel stages.
  agent any

  environment {
    // Hacky way of setting some convenience global vars in the pipeline - not really
    // intended as shell env vars.
    jenkinsImageTag = "${dockerImageName}:${env.GIT_COMMIT}"
  }

  stages {

    stage('build') {
      steps {
        sh "docker build --tag ${jenkinsImageTag} -f Dockerfile.ci ."
      }
    }

    stage('tests') {
      parallel {

        stage('server') {
          steps {
            sh "docker run -i ${jenkinsImageTag} test:server"
          }
        }

        stage('client') {
          steps {
            sh "docker run -i ${jenkinsImageTag} test:client"
          }
        }

      }
    }

  }

  post {
    always {
      // NOTE: removing cleanImages might make sense - complete Dockerfile.ci
      // build takes ~3 minutes, large part of that being xelatex installation.
      cleanImages dockerImageName
    }
  }

}
