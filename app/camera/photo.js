/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image
} from 'react-native';
import Camera from 'react-native-camera';
import { Icon, Button } from '@shoutem/ui';
import { Icon as Ikona } from 'react-native-elements';
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux';
import firebase from '../firebase/firebase';
import UUIDGenerator from 'react-native-uuid-generator';
import moment from 'moment';
const PicturePath = "";

export class Photo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taken: false,
      data: this.props.navigation.state.params,
    }

  }
  takePicture() {
    this.camera.capture()
      .then((data) => {
        console.log(data);
        PicturePath = data.path;
        this.setState({
          taken: true,
        })
      })
      .catch(err => console.error(err));
  }
  storePicture() {
    console.log(PicturePath);
    const { grade, semester, subject, topic, nova, description } = this.state.data;
    const { uniqueID } = this.props;
    const backAction = NavigationActions.back({
      key: this.state.data.key
    })
    let x;
    UUIDGenerator.getRandomUUID().then((uuid) => {
      x = uuid;
      const metadata = {
        contentType: 'image/jpeg'
      }
      firebase.storage()
        .ref(x + '.jpg')
        .putFile(PicturePath, metadata)
        .then((uploadedFile) => {
          let l;

          l = uploadedFile.downloadUrl;
          while (typeof l !== 'string');
          if (nova) {
            firebase.database().ref(`topics/${uniqueID.id}/${grade}/${semester}/${subject}`)
              .push({
                title: topic,
                author: uniqueID.name,
                description,
                timestamp: moment(),
                rating: 0,
                comments: {
                  value: 0,
                },
                urls: {
                  newID: {
                    photo: l,
                    source: {
                      uri: l,
                    }
                  }
                }
              },
              (err) => {
                console.log(err);
                l = true;
                firebase.database().ref(`topics/${uniqueID.id}/${grade}/${semester}/${subject}`)
                  .update({ value: 1 })
              });
          } else {
            const { topic } = this.state.data;
            firebase.database().ref(`topics/${uniqueID.id}/${grade}/${semester}/${subject}/${topic}/urls`)
              .push({
                source: {
                  uri: l
                }

              },
              (err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });

    });
    this.props.navigation.dispatch(backAction);
  }

  render() {
    if (!this.state.taken) {
      return (
        <View style={styles.container}>
          <Camera
            ref={(cam) => {
              this.camera = cam;
            }}
            style={styles.preview}
            aspect={Camera.constants.Aspect.fill}
            captureTarget={Camera.constants.CaptureTarget.disk}
            captureQuality={Camera.constants.CaptureQuality["1080p"]}>
            <Ikona
              reverse
              name='camera'
              type='evilicon'
              color='green'
              onPress={this.takePicture.bind(this)} />
          </Camera>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Image
            source={{ uri: PicturePath, isStatic: true }} style={styles.preview}
          >
            <Ikona
              reverse
              name='cloud-upload'
              type='simple-line-icon'
              color='green'
              onPress={this.storePicture.bind(this)} />
          </Image>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  }
});

AppRegistry.registerComponent('Photo', () => Photo);

const mapStateToProps = (state, ownProps) => {
  console.log(state, ownProps);
  return state;
}

export default connect(mapStateToProps)(Photo);