'use strict';

const { CODES, MESSAGES } = require('./statuscodes');

const {
    getAllFromStorage,
    getOneFromStorage,
    addToStorage,
    updateStorage,
    removeFromStorage
} = require('./storageLayer');

module.exports = class Datastorage {

    get CODES() {
        return CODES;
    } // getter end

        getAll() {
            return getAllFromStorage();
        } // getAll end

        getOne(id) {
            return new Promise(async (resolve, reject) => {
                if(!id) {
                    reject (MESSAGES.NOT_FOUND('--empty--'));
                }
                else {
                    const result = await getOneFromStorage(id);
                    if(result){
                        resolve(result);
                    }
                    else {
                        reject(MESSAGES.NOT_FOUND(id));
                    }
                }
            });
        } // getOne end

        insert(moped) {
            return new Promise(async (resolve, reject) => {
                if(moped){
                    if(!moped.id) {
                        reject(MESSAGES.NOT_INSERTED());
                    }
                    else if(await getOneFromStorage(moped.id)) {
                        reject(MESSAGES.ALREADY_IN_USE(moped.id));
                    }
                    else if(await addToStorage(moped)) {
                        resolve(MESSAGES.INSERT_OK(moped.id));
                    }
                    else {
                        reject(MESSAGES.NOT_INSERTED());
                    }
                }
                else {
                    reject(MESSAGES.NOT_INSERTED());
                }
            });
        } // add end

        update(moped) {
            return new Promise(async (resolve, reject) => {
                if(moped) {
                    if(await updateStorage(moped)) {
                        resolve(MESSAGES.UPDATE_OK(moped.id));
                    }
                    else {
                        reject(MESSAGES.NOT_UPDATED());
                    }
                }
                else {
                    reject(MESSAGES.NOT_UPDATED());
                }
            });
        } // update end

        remove(id) {
            return new Promise(async (resolve, reject) => {
                if(!id) {
                    reject(MESSAGES.NOT_FOUND('--empty--'));
                }
                else if (await removeFromStorage(id)) {
                    resolve(MESSAGES.REMOVE_OK(id));
                }
                else {
                    reject(MESSAGES.NOT_REMOVED(id));
                }
            });
        } // remove end
} // end of class