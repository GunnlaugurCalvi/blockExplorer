import React, { Component } from 'react';
import './style.css';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import Web3 from 'web3';
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

class Home extends Component { 
    state = {
        block_ids: [],
        block_hashes: [],
        curr_block: null,
        Tx: []
    };
    async componentWillMount() {
        console.log(await web3.eth.getAccounts());
        const curr_block_no = await web3.eth.getBlockNumber();
        console.log(curr_block_no);
        this.setState({ curr_block: curr_block_no });
        this.getBlocks(curr_block_no);

    }

    async getBlocks(curr_block_no) {
        const block_ids = this.state.block_ids.slice();
        const block_hashes = this.state.block_hashes.slice();
        let max_blocks = 10;
        
        if(curr_block_no > max_blocks){
            max_blocks = curr_block_no;
        }

        for(let i = 0; i < max_blocks; i++, curr_block_no--){
            let currBlockObj = await web3.eth.getBlock(curr_block_no);
            block_ids.push(currBlockObj.number);
            block_hashes.push(currBlockObj.hash);
        }

        this.setState({
            block_ids: block_ids,
            block_hashes: block_hashes
        });

    }

    render() {
        let tableRows = [];
        _.each(this.state.block_ids, (value, index) => {
            tableRows.push(
                <tr key={this.state.block_hashes[index]}>
                    <td className="tdCenter">{this.state.block_ids[index]}</td>
                    <td><Link to={`/block/${this.state.block_hashes[index]}`}>{this.state.block_hashes[index]}</Link></td>
                </tr>
            )
        });
        return (
            <div className="Home">
                <h2>Home page</h2>
                Current Block: {this.state.curr_block}
                <table>
                    <thead>
                        <tr>
                            <th>Block no</th>
                            <th>Hash</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableRows}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Home;