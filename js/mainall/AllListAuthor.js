/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow　主界面分页－所有－作者列表
 */

import React, {Component} from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    TouchableOpacity,
    NativeModules,
} from 'react-native'
import PropTypes from 'prop-types'
import NetUtils from "../util/NetUtil"
import constants from '../Constants'
import AuthorPage from '../author/AuthorPage'
import ServerApi from '../ServerApi'

let toast = NativeModules.ToastNative
let {width, height} = constants.ScreenWH


//设置数据源
let ds = new ListView.DataSource({
    //返回条件，任意两条不等
    rowHasChanged: (r1, r2) => r1 != r2
})

class AllListAuthor extends Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.index = 0
        this.renderRow = this.renderRow.bind(this)
    }

    /**
     * 发起网络请求
     */
    componentDidMount() {
        this.getHotAuthorData()
    }

    /**
     * 父组件传参变化回调
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        this.getHotAuthorData()
    }

    render() {
        return (
            <View
                style={[styles.container, {backgroundColor: constants.nightMode ? constants.nightModeGrayLight : 'white'}]}>
                <Text style={{
                    color: constants.nightMode ? 'white' : constants.normalTextColor,
                    fontSize: width * 0.04,
                    marginTop: width * 0.016,
                    marginLeft: width * 0.06
                }}>近期热门作者</Text>
                {this.renderList()}

                <View style={{width: width, height: width * 0.26, alignItems: 'center', justifyContent: 'center',}}>
                    <View style={{
                        width: width * 0.22,
                        height: width * 0.096,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderColor: '#808080',
                        borderWidth: width * 0.003,
                        borderRadius: width * 0.005,
                    }}>
                        <TouchableOpacity onPress={() => {this.changeAuthor()}}>
                            <Text style={{
                                textAlign: 'center',
                                fontSize: width * 0.034,
                                color: constants.nightMode ? 'white' : constants.normalTextColor
                            }}>
                                换一换
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>

            </View>
        )
    }

    // 热门作者列表
    renderList() {
        if (this.state.dataSource !== undefined) {
            // console.log(this.state.dataSource);
            return (
                <ListView dataSource={this.state.dataSource}
                          renderRow={this.renderRow}>
                </ListView>
            )
        }
    }

    // 单个item返回 线性布局
    renderRow(rowData, sectionID, rowID, highlightRow) {
        // console.log(rowData);
        return (
            <View style={[styles.contentContainer, {
                backgroundColor: constants.nightMode ? constants.nightModeGrayLight : 'white',
                borderBottomColor: constants.nightMode ? constants.nightModeGrayDark : constants.itemDividerColor
            }]}>
                <TouchableOpacity activeOpacity={0.5} style={{flexDirection: 'row'}}
                                  onPress={() => this.pushToAuthor(rowData)}>
                    {/*左边头像*/}
                    <Image source={{uri: rowData.web_url}} style={styles.leftImage}>
                    </Image>
                    {/*右边文字*/}
                    <View style={styles.rightContainer}>
                        {/*上面名字*/}
                        <Text
                            style={[styles.topText, {color: constants.nightMode ? 'white' : constants.normalTextColor}]}>
                            {rowData.user_name}
                        </Text>
                        {/*下面介绍*/}
                        <Text
                            style={[styles.bottomText, {color: constants.nightMode ? 'white' : constants.normalTextLightColor}]}
                            numberOfLines={1}>
                            {rowData.desc}
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.follow}
                    activeOpacity={0.5}
                    onPress={() => toast.showMsg('demo不支持此功能', toast.SHORT)}>

                    <Text style={{
                        textAlign: 'center',
                        fontSize: width * 0.034,
                        color: constants.nightMode ? 'white' : constants.normalTextLightColor
                    }}>
                        关注
                    </Text>

                </TouchableOpacity>
            </View>
        )
    }

    changeAuthor(){
        this.index ++
        this.setAuthor(this.state.result)
    }

    setAuthor(author){
        let itemArr = []
        let i = 0
        // 循环3次，取出3个作者
        while (i < 3){
            if (this.index >= itemArr.length - 1){ //当前越界
                this.index = this.index - (itemArr.length - 1) //指针回到头部继续
            }
            console.log('取出index',this.index)
            itemArr.push(author.data[this.index]) //放入作者数据
            this.index ++ //指针后移
            i ++ //当前次数+1
        }
        this.setState({
            dataSource: ds.cloneWithRows(itemArr),
        })
    }

    // 请求专题数据
    getHotAuthorData() {
        console.log('请求author')
        NetUtils.get(ServerApi.HotAuthor, null, (result) => {
            this.props.onSuccess && this.props.onSuccess()
            this.setState({
                author: result,
            })
            this.setAuthor(result)

            // console.log(result);
        }, (error) => {
            console.log('error' + error)
            this.props.onError && this.props.onError()
        })
    }

    /**
     * 跳转到作者页
     * @param url
     */
    pushToAuthor(itemData) {
        this.props.navigator.push(
            {
                component: AuthorPage,
                title: '作者页',
                params: {
                    authorId: itemData.user_id,
                    authorName: itemData.user_name
                }
            }
        )
    }
}

AllListAuthor.propTypes = {
    onError: PropTypes.func,
    onSuccess: PropTypes.func
}
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
    },
    contentContainer: {
        marginTop: width * 0.05,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },

    rightContainer: {
        justifyContent: 'center'
    },
    leftImage: {
        marginTop: width * 0.02,
        marginBottom: width * 0.02,
        marginRight: width * 0.04,
        width: width * 0.11,
        height: width * 0.11,
        borderRadius: width * 0.6,
        resizeMode: 'stretch',
    },
    topText: {
        width: width * 0.54,
        fontSize: width * 0.04,
    },
    bottomText: {
        width: width * 0.54,
        marginTop: width * 0.004,
        fontSize: width * 0.034,
    },

    follow: {
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#b4b4b4',
        borderWidth: width * 0.003,
        borderRadius: width * 0.005,
        marginLeft: width * 0.06,
        width: width * 0.14,
        height: width * 0.09,
    }
})

export default AllListAuthor
