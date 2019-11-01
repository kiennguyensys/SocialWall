import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import database from '../firebase-redux/actions/database';
import firebaseDB from '../firebase-redux/firebase';
import store from '../firebase-redux/store';
import { Layout, Menu, Row, Col, Icon, Avatar } from 'antd';
import 'antd/dist/antd.css'; import './wallSite.css';
import ImagePost from './ImagePost.js';
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class wallSite extends React.Component {
    state = {collapsed: false, post_title: '', post_image: '', user_email:'', post_invitedEmails: '', userID: ''};

    componentDidMount () {
        const uid = firebaseDB.auth().currentUser.uid;
        this.setState({userID: uid})
        database.getPosts(uid)
    }

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
    };

    updateOtherProfile = (user) => {
        console.log('update!')
        store.dispatch({
            type: `POST_DETACH`,
            payload: {}
        });

        database.getPosts(user.id)
        database.getUserInfo(user.id)
    }

    handleTitleChange = (e) => {
        this.setState({post_title : e.target.value})
    }

    handleUrlChange = (e) => {
        this.setState({post_image : e.target.value})
    }

    handleInvitedEmails = (e) => {
        this.setState({post_invitedEmails: e.target.value})
    }

    handleUserSearching = (e) => {
        this.setState({user_email: e.target.value})
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const post = {
            image_url : this.state.post_image,
            title : this.state.post_title,
            invited_IDs: [this.state.post_invitedEmails]
        }
        database.createPost(post)
    }

    handleSearchSubmit = async (e) => {
        e.preventDefault()
        const result = await database.searchUser(this.state.user_email)
        console.log(result)
        if(result.length !== 0) {
            this.setState({userID: result.id})
            this.updateOtherProfile(result)
        }
    }


    splitEvery = (array, length) => {
        if(!array.length) return []
        const splitArr = []
        let chunkIndex = -1

        array.forEach((item, index) => {
            if (index % length === 0) {
                splitArr.push([])
                chunkIndex += 1
              }
            splitArr[chunkIndex].push(array[index])
        });
        return splitArr
    }

    render() {
        return (
        <Layout>
            <Sider style={{overflow: 'auto', height: '100vh', position: 'fixed', left: 0}} >
                <div className="introduction" />
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
                    <Menu.Item key="1">
                        <Icon type="user" />
                <span className="nav-text">{this.props.userInfo.Job}</span>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <Icon type="home" />
                <span className="nav-text">{this.props.userInfo.From}</span>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <Icon type="star" />
                <span className="nav-text">{this.props.userInfo.Born}</span>
                    </Menu.Item>
                    <Menu.Item key="4">
                        <Icon type="heart" />
                <span className="nav-text">{this.props.userInfo.Interests}</span>
                    </Menu.Item>

                </Menu>
            </Sider>
            <Layout style={{ marginLeft: 200 }}>
                <Header style={{ background: '#fff', padding: 0, width: '100vw', height: '128px', display: 'flex'}}>
                <Avatar size={100} style={{margin: 20}} src={this.props.userInfo.avatar_url}/>
                    <div style={{display: 'flex', flex : 3, alignItems: 'center', justifyContent: 'center' }}>
                        <h3>{this.props.userInfo.username}</h3>
                    </div>
                </Header>

                <Content style={{ margin: '24px 16px 0', overflow: 'scroll' }}>
                <div style={{padding: 24}}>
                {
                    (this.state.userID === firebaseDB.auth().currentUser.uid) &&

                <form onSubmit={this.handleSubmit}>
                  <label>
                    Title:
                <input type="text" value={this.state.post_title} onChange={this.handleTitleChange} />
                  </label>
                  <label>
                    image_url:
                <input type="text" value={this.state.post_image} onChange={this.handleUrlChange} />
                  </label>
                  <label>
                    invite Email:
                <input type="text" value={this.state.post_invitedEmails} onChange={this.handleInvitedEmails} />
                  </label>

                  <input type="submit" value="Create Post" />
                </form>

                }
                <form onSubmit={this.handleSearchSubmit}>
                  <label>
                    Search User:
                <input type="text" value={this.state.user_email} onChange={this.handleUserSearching} />
                  </label>
                  <input type="submit" value="Search" />
                </form>

                </div>
                <div style={{ padding: 24, background: '#fff', alignItems: 'center'}}>

                    {
                        this.props.posts && this.splitEvery(this.props.posts.arr, 3).map(postsChunk => (
                            <Row gutter={[40, 40]}>
                                {
                                    postsChunk.map(post => (
                                            <Col span={8}>
                                            <ImagePost post={post} user={this.props.user}/>
                                            </Col>
                                    ))
                                }
                            </Row>
                      ))
                    }
                </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Created by Kien</Footer>
            </Layout>
        </Layout>
    );
  }
}

export default connect(
	state => ({
		user: state.user,
        userInfo: state.userInfo,
        postIDs: state.postIDs,
        posts: state.posts,
	}),
	null
)(wallSite);