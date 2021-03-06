import React from 'react';
import moment from 'moment';
import {
  TouchableOpacity,
  Subtitle,
  Caption,
  View,
  Image,
  Row,
  Divider,
} from '@shoutem/ui';
import Icon from 'react-native-vector-icons/FontAwesome';
/**
 * A component used to render a single list article item
 */
export class ListTopic extends React.Component {
  static propTypes = {
    onPress: React.PropTypes.func,
    articleId: React.PropTypes.string,
    title: React.PropTypes.string,
    imageUrl: React.PropTypes.string,
    date: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    this.props.onPress(this.props.articleId);
  }

  render() {
    const { title, imageUrl, date } = this.props;

    const momentDate = moment(date);
    const dateInfo = momentDate.isAfter(0) ? (
      <Caption>{momentDate.fromNow()}</Caption>
    ) : null;

    return (
      <TouchableOpacity onPress={this.onPress}>
        <Row style={{ backgroundColor: '#BFECCF', top: 0 }}>
          <Image
            styleName="small rounded-corners placeholder"
            source={{ uri: imageUrl+'=s80' }}
          />
          <View styleName="vertical stretch space-between">
            <Subtitle numberOfLines={2}>{title}</Subtitle>
            <View style={{ flexDirection: 'row' }}>
              <Subtitle>{this.props.rating === undefined ? 0.0 : this.props.rating.toFixed(1)} </Subtitle>
              <Icon
                name="star"
                size={15}
                color={'green'}
              />
            </View>
            {dateInfo}
          </View>
        </Row>
        <Divider styleName="line" style={{ borderColor: '#565656' }} />
      </TouchableOpacity>
    );
  }
}