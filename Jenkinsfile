#!/usr/bin/env groovy

pipeline {

  agent any

  environment {
    // Hacky way of setting some convenience global vars in the pipeline - not really
    // intended as shell env vars.
    jenkinsImageTagClient = "resumake-ci-client:${env.GIT_COMMIT}"
    jenkinsImageTagServer = "resumake-ci-server:${env.GIT_COMMIT}"
  }

  stages {

    stage('client') {

      stages {

        stage('build') {
          steps {
            sh "docker build --tag ${jenkinsImageTagClient} -f Dockerfile.ci.client ."
          }
        }

        stage('tests') {

          parallel {
            stage('lint') {
              steps {
                sh "docker run -i ${jenkinsImageTagClient} run lint"
              }
            }

            stage('type-check') {
              steps {
                sh "docker run -i ${jenkinsImageTagClient} run flow"
              }
            }

            stage('test') {
              steps {
                sh "docker run -i ${jenkinsImageTagClient} run jest"
              }
            }

          }

        }

      }

    }

    stage('server') {

      stages {

        stage('build') {
          steps {
            sh "docker build --tag ${jenkinsImageTagServer} -f Dockerfile.ci.server ."
          }
        }

        stage('tests') {

          parallel {
            stage('lint') {
              steps {
                sh "docker run -i ${jenkinsImageTagServer} run lint"
              }
            }

            stage('type-check') {
              steps {
                sh "docker run -i ${jenkinsImageTagServer} run flow"
              }
            }

            stage('test') {
              steps {
                sh "docker run -i ${jenkinsImageTagServer} run jest"
              }
            }

          }

        }

      }

    }

  }

}
