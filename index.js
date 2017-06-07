const Promise = require('bluebird');
const rp = require('request-promise');
const fs = require('fs-extra');
const _ = require('lodash');
// const h2j = require('html2json').html2json;

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
            // console.log(f);
            return f.children;
        });
        let root_folder_children_counts = root_folder_children.map(f => {
            return f.length;
        });
        // console.log(roots);
        console.log(root_folder_names);
        console.log(root_folder_children_counts);
    })
    .catch(err => console.log(err));
