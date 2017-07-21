/*
 * @flow
 * */
import React from 'react';
import PropTypes from 'prop-types';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';
import IoniconIcon from 'react-native-vector-icons/Ionicons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import OcticonIcon from 'react-native-vector-icons/Octicons';
import ZocialIcon from 'react-native-vector-icons/Zocial';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
import { View, StyleSheet, TouchableOpacity, Text, ActionSheetIOS } from 'react-native';

type ActionType = Object;

class Action extends React.PureComponent {
  render() {
    return null;
  }
}

class NestedAction extends React.PureComponent {
  render() {
    return null;
  }
}

export default class BottomToolbar extends React.PureComponent {
  static Action = Action;
  static NestedAction = NestedAction;

  render() {
    const { onPress, buttonStyle, wrapperStyle, showIf, children } = this.props;

    if (!showIf) return null;

    return (
      <View style={[styles.wrapper, wrapperStyle]}>
        <View style={styles.columnWrap}>
          {React.Children.map(children, (child, index) => {
            if (!child) return null;

            const disabled = isDisabled(child);
            const Element = disabled ? View : TouchableOpacity;

            const childProps = child.props;
            const fnc = () => showActionSheet(child, onPress);
            const onActionPress = (childProps.children && fnc) || childProps.onPress || onPress;
            return (
              <Element
                style={[styles.buttonDefaults, buttonStyle]}
                key={`${child.title}`}
                onPress={() => onActionPress(index, childProps)}
              >
                {this.renderTabContent(childProps, disabled, index)}
              </Element>
            );
          })}
        </View>
      </View>
    );
  }

  renderTabContent(childProps: Object, disabled: boolean, index: number) {
    const { font, size, color, textStyle, disabledColor, customRenderer } = this.props;

    if (customRenderer) {
      return customRenderer(childProps, index);
    } else if (childProps.iconName) {
      return renderIcon(
        childProps.font || font,
        childProps.iconName,
        childProps.size || size,
        disabled ? disabledColor : childProps.color || color
      );
    } else {
      return renderText(childProps, textStyle, disabled && { color: disabledColor });
    }
  }
}

const isDisabled = (action: ActionType): boolean => {
  const { children, disabled } = action.props;
  if (children) {
    // cancel action or no action
    const onlyCancelActionPresent =
      React.Children.toArray(children).find(nested => nested.props.style !== 'cancel') ===
      undefined;
    return onlyCancelActionPresent || disabled;
  } else {
    return disabled;
  }
};

const renderIcon = (font: string, name: string, size: number, color: string) => {
  switch (font) {
    case 'ionicons':
      return <IoniconIcon name={name} size={size} color={color} />;
    case 'material':
      return <MaterialIcon name={name} size={size} color={color} />;
    case 'font-awesome':
      return <AwesomeIcon name={name} size={size} color={color} />;
    case 'evil-icons':
      return <EvilIcon name={name} size={size} color={color} />;
    case 'simple':
      return <SimpleIcon name={name} size={size} color={color} />;
    case 'entypo':
      return <EntypoIcon name={name} size={size} color={color} />;
    case 'foundation':
      return <FoundationIcon name={name} size={size} color={color} />;
    case 'octicons':
      return <OcticonIcon name={name} size={size} color={color} />;
    case 'zocial':
      return <ZocialIcon name={name} size={size} color={color} />;
    default:
      return <IoniconIcon name={name} size={size} color={color} />;
  }
};

const renderText = (childProps: Object, textStyle, colorStyle = {}) => {
  return (
    <Text style={[styles.text, textStyle, colorStyle]}>
      {childProps.title}
    </Text>
  );
};

const showActionSheet = (
  directChild: ActionType,
  rootOnPress: (index: number, nestedAction: Object) => void
) => {
  let nestedChildren = React.Children.toArray(directChild.props.children);
  let options = nestedChildren.map(it => it.props.title);
  let styles = nestedChildren.map(it => it.props.style);
  let destrIndex = styles.indexOf('destructive');
  let cancelIndex = styles.indexOf('cancel');
  // todo warn if -1
  ActionSheetIOS.showActionSheetWithOptions(
    {
      options,
      cancelButtonIndex: cancelIndex,
      destructiveButtonIndex: destrIndex,
      title: directChild.props.actionSheetTitle,
      message: directChild.props.actionSheetMessage,
    },
    (buttonIndex: number) => {
      let fncToCall =
        nestedChildren[buttonIndex].props.onPress || directChild.props.onPress || rootOnPress;
      fncToCall(buttonIndex, nestedChildren[buttonIndex].props);
    }
  );
};

BottomToolbar.propTypes = {
  /*
     * font family from react-native-vector icons
     * */
  font: PropTypes.string,
  /*
     * icon size
     * */
  size: PropTypes.number,
  /*
     * onPress for handling icon or text press
     * receives (index: number, action: Object)
     * */
  onPress: PropTypes.func,
  /*
     * custom styles
     * */
  wrapperStyle: PropTypes.object,
  textStyle: PropTypes.object,
  buttonStyle: PropTypes.object,
  color: PropTypes.string,
  disabledColor: PropTypes.string,
  showIf: PropTypes.bool,
  customRenderer: PropTypes.func,
  children: PropTypes.any.isRequired,
};

Action.propTypes = {
  /*
     * the actions:
     * if onPress, size, color, font are provided in the action, they override the ones passed to the component
     * */
  title: PropTypes.string.isRequired,
  iconName: PropTypes.string,
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
  color: PropTypes.string,
  font: PropTypes.string,
  size: PropTypes.number,

  /*
      * for the nested actions that are displayed in an actionSheet:
      * */
  actionSheetTitle: PropTypes.string,
  actionSheetMessage: PropTypes.string,
};

NestedAction.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  style: PropTypes.oneOf(['cancel', 'destructive']),
};

BottomToolbar.defaultProps = {
  color: '#007AFF',
  disabledColor: 'grey',
  font: 'ionicons',
  size: 28,
  onPress: (index: number, action: ActionType) => {},
  wrapperStyle: {},
  textStyle: {},
  buttonStyle: {},

  actionSheetTitle: null,
  actionSheetMessage: null,
  showIf: true,
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'rgba(245,245,245,1)',
    flexDirection: 'row',
    bottom: 0,
    left: 0,
    right: 0,
    height: 43,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'grey',
  },
  columnWrap: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: 17,
    color: '#007AFF',
  },
  buttonDefaults: {
    paddingHorizontal: 15,
  },
});
