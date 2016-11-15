// 'using' statements
import "babel-polyfill"
import fetch from "isomorphic-fetch"
import React, {Component} from 'react'
import {render} from 'react-dom'
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router'

// Utility methods
// --------------
const log = (...a) => console.log(...a)

const get = (url) =>
    fetch(url, {credentials: 'same-origin'})
    .then(r => {
        return r.json()
    })
    .catch(e => log(e))

const post = (url, data) => 
    fetch(url, { 
        method: 'POST',
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .catch(e => log(e))
    .then(r => r.json())
// ----------------

const Tweet = (tweet) => 
    <a className="tweet" href={`#/status/${tweet.id}`}>
        <p>{tweet.text}</p>
        <span>{tweet.user}</span>
    </a>

class Home extends Component {
    constructor(props){
        super(props)
        this.state = {
            items: []
        }
    }
    componentDidMount(){
        get('/api/tweet').then(tweets => {
            tweets = tweets.reverse()
            this.setState({items: tweets})
        }).catch(e => log(e))
    }
    render(){
        return <div className="grid grid-3-600">
            {this.state.items.map(Tweet)}
        </div>
    }
}

class TweetPage extends Component {
    constructor(props){
        super(props)
        this.state = { id: props.params.id } 
    }
    componentDidMount(){
        get('/api/tweet/'+this.state.id).then(x => {
            this.setState({ item: x })
        })
    }
    render() {
        const item = this.state.item
        if(!item)
            return <div/>

        return <div className="tweet">
            <h5>{item.user}</h5>
            <hr/>
            <p>{item.text}</p>
        </div>
    }
}

const Layout = ({children}) => 
    <div>
        <div className="menu">
            <h6>Matter</h6>
            <a href="#/compose" className="compose-button"/>
        </div>
        {children}
    </div>

const Error = () => <div>Page Not Found</div>

class ComposePage extends Component {
    constructor(props){
        super(props)
        this.state = {}
    }
    submit(e){
        e.preventDefault()
        post('/api/tweet', {
            text: this.refs.text.value,
            user: this.refs.user.value
        }).then(x => {
            if(!x.errors) window.location.hash = `#/status/${x.id}`

            this.setState({ errors: x.errors })
        }).catch(e => alert(e))
    }
    render(){
        var err 
        if(this.state.errors){
            err = <ul className="compose-errors">
                    {this.state.errors.map(x => <li>{x}</li>)}
                </ul>
        }

        return <form className="compose-screen" onSubmit={e => this.submit(e)}>

            {this.state.errors ? <p>There were errors with your tweet:</p> : null}
            {err}

            <div>
                <input ref="user" type="text" placeholder="Username" required />
                <textarea ref="text" placeholder="Your message" required></textarea>
            </div>
            <div>
                <button type="submit">Live Tweet or Die Tryin'</button>
            </div>
        </form>
    }
}

const reactApp = () => 
    render(
        <Layout>
            <Router history={hashHistory}>
                <Route path="/" component={Home}/>
                <Route path="/status/:id" component={TweetPage}/>
                <Route path="/compose" component={ComposePage}/>
                <Route path="*" component={Error}/>
            </Router>
        </Layout>,
    document.querySelector('.app'))

reactApp()

// Flow types supported (for pseudo type-checking at runtime)
// function sum(a: number, b: number): number {
//     return a+b;
// }
//
// and runtime error checking is built-in
// sum(1, '2');