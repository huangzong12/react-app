/**
 * MonkeyNews
 *
 * author: xietao3
 *
 * blog: xietao3.com
 */

'use strict';

import React, {Component} from 'react';
import {
    StyleSheet,
    FlatList,
} from 'react-native'

import MKBasePage from '../MKBasePage';
import MKServices from '../../Services/MKServices';
import ThemeListItem from '../../Common/MKThemeListItem';

export default class MKCategoryPage extends MKBasePage {
    static navigationOptions = {
        headerTitle: '频道'
    };

    constructor(props) {
        super(props);
        this.state = {
            themeList:[],
        }

    }

    componentDidMount() {
        this.getThemeList();
    };

    componentWillUnmount(){
        this.setState = ()=>{
            return null;
        };
    };

    getThemeList() {
        this.startLoading();

        MKServices.requestThemeList().then((responseData) => {
            this.stopLoading({
                themeList: responseData.others
            });
        }).catch((error) => {
            this.requestFailure();
            console.log(error);
        });
    };

    renderItem({item}) {
        return (
            <ThemeListItem
                id={item.id}
                onPress={() => {
                    this.props.navigation.navigate('themeDetail',{theme:item})
                }}
                item={item}
            />
        );
    }

    placeholderOnRefresh() {
        this.getThemeList();
    }

    render() {
        if (this.state.themeList.length > 0) {
            return super.render(
                <FlatList
                    style={[styles.listView]}
                    data={this.state.themeList}
                    keyExtractor={(item) => {return (item.id + '')}}
                    renderItem={this.renderItem.bind(this)}
                />
            );
        }else {
            return super.render(null);
        }
    };
}

const styles = StyleSheet.create({
    listView: {
        flex:1,
    },
});
