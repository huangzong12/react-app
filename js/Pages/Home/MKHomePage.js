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
    SectionList,
} from 'react-native';

import MKBasePage from '../MKBasePage';
import ListItem from '../../Common/MKNewsListItem';
import {Line} from '../../Common/MKCommonComponents';
import MKNewsSection from '../../Common/MKNewsSection';
import MKServices from '../../Services/MKServices';
import MKSwiper from '../../Common/MKSwiper';
import MKPlaceholderView from '../../Common/MKPlaceholderView'

// import {layout} from "../../Config/MKConstants";

export default class MKHomePage extends MKBasePage {
    static navigationOptions = {
        headerTitle: '今日热点',
    };
    constructor (props) {
        super(props);
        this.state = {...super.state};
        this.state = {
            sections:[],
            rotations:[],
            lastDate:0,
            refreshing:false,
        }
    };

    componentDidMount() {
        this.getNewestNews();
    };

    getNewestNews() {
        this.startLoading();
        this.setState({
            refreshing: true,
        });

        MKServices.requestNewestNews().then((responseData) => {
            let tempData = [{
                key:100,
                data:responseData.stories
            }];
            this.setState({
                sections: tempData,
                rotations: responseData.top_stories,
                lastDate: responseData.date,
                refreshing: false,
            });
            this.stopLoading();

        }).catch((error) => {
            this.requestFailure();
            console.log(error);
        });
    };

    getMoreNews() {

        MKServices.requestBeforeNews(this.state.lastDate).then((responseData) => {

            let tempData = this.state.sections;
            tempData.push({
                key:responseData.date,
                data:responseData.stories
            });
            this.setState({
                sections: tempData,
                lastDate: responseData.date,
            })
        }).catch((error) => {

            console.log(error);
        });
    };

    renderItem ({item}) {
        return (
            <ListItem
                id={item.id}
                onPressItem={(title) => {

                }}
                title={item.title}
                item={item}
            />
        );
    };


    render () {

        if (!this.state.isLoading) {
            return super.render(
                <SectionList
                    renderSectionHeader={(info) => {
                        return (<MKNewsSection section={info.section}/>)
                    }}
                    style={[styles.listView]}
                    sections={this.state.sections}
                    ListHeaderComponent={(<MKSwiper stories={this.state.rotations}/>)}
                    renderItem={this.renderItem.bind(this)}
                    keyExtractor={(item) => {
                        return (item.id + '')
                    }}
                    onEndReachedThreshold={0.1}
                    onEndReached={this.getMoreNews.bind(this)}
                    onRefresh={this.getNewestNews.bind(this)}
                    refreshing={this.state.refreshing}
                    stickySectionHeadersEnabled={false}
                    ItemSeparatorComponent={Line}
                />
            );

        }else {
            return super.render(
                <MKPlaceholderView isLoading={this.state.isLoading} reloadEvent={this.getNewestNews.bind(this)} />
            );
        }

    };

}

const styles = StyleSheet.create({
    listView: {
        flex:1,
    },

});