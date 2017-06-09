const Promise = require('bluebird');
const rp = require('request-promise');
const fs = require('fs-extra');
const _ = require('lodash');

fs.readJson('bookmarks.json')
    .then(result => {
        let roots = result.roots;
        let root_keys = Object.keys(roots);
        let root_set_types = root_keys.map(k => {
            return roots[k].type;
        });
        let root_folder_keys = root_keys.filter(k => {
            return roots[k].type === 'folder';
        })
        let root_folders = root_folder_keys.map(k => {
            return roots[k];
        });
        let root_folder_names = root_folders.map(f => {
            return f.name;
        });
        let root_folder_children = root_folders.map(f => {
            return f.children;
        });
        let master_links_array = [];
        root_folder_names.forEach((element,idx) => {
            collect_links(master_links_array, element, root_folder_children[idx]);
        });
        let requests_setup = master_links_array.map(link => {
            let split_link = link.split('|||');
            return {
                dir_string: split_link[0],
                url: split_link[1]
            };
        });
        requests_setup = requests_setup.filter((element) => {
            return !(_.includes(element.url,'chrome://') || _.includes(element.url,'localhost') || _.includes(element.url,'ftp://') || _.includes(element.url,'whichasteroidbroughtmehere.com') || _.includes(element.url,'50.23.99.148') || _.includes(element.url,'algorithmsandme'));
        });
        console.log(requests_setup.length);
        return Promise.mapSeries(requests_setup, element => {
            return Promise.all([
                element,
                rp({ uri: element.url, simple: false })
            ]);
        });
    })
    .then(results => {
        let responses = {};
        results.forEach(element => {
            console.log(element[1].response);
        })
    })
    .catch(err => console.log(err));


function collect_links(master_arr, dir_string, folder_set) {
    folder_set.forEach((element, idx) => {
        if (element.type === 'url') {
            master_arr.push(`${dir_string}___${idx.toString()}|||${element.url}`)
        } else if (element.type === 'folder') {
            collect_links(master_arr, `${dir_string}___${idx.toString()}___${element.name}`, element.children);
        } else {
            console.log(`Found something else... ${element.type}`);
        }
    });
}
