const RumbleShopItem = require('../_database/models/rumbleShopItemSchema')
const RumbleShop = require('../_database/models/rumbleShopSchema')
const { addLog } = require('./logs')
const mongoose = require('mongoose')

let lastRefresh = ""

async function getLastRefresh() {
    if (!lastRefresh) {
        let shop = await getShop();
        lastRefresh = shop.lastReset
    }
    return lastRefresh
}

async function getShop() {
    let shop = await RumbleShop.findOne();
    if (!shop) {
        shop = await new RumbleShop({
            _id: mongoose.Types.ObjectId(),
            lastReset: ''
        })
    }

    return shop
}

async function setLastRefresh(refreshStamp) {
    let shop = await getShop()
    shop.lastReset = refreshStamp
    await shop.save().catch(error => addLog(null, error, error.stack))

    lastRefresh = shop.lastReset
}

async function setItemRefresh(name, item, refreshStamp) {
    if (!item) item = await getRumbleShopItem(name)
    if (!item) item = await addRumbleShopItem(name, '', '')

    item.lastSeen = refreshStamp
    await item.save().catch(error => addLog(null, error, error.stack))
}

async function getRumbleShopItem(name) {
    let rumbleShopItem = await RumbleShopItem.findOne({
        name: name
    })
    return rumbleShopItem
}

async function getRumbleShopItems() {
    let rumbleShopItems = await RumbleShopItem.find()
    return rumbleShopItems
}

async function addRumbleShopItem(name, image, era) {
    let rumbleShopItem = await getRumbleShopItem(name)

    if (!rumbleShopItem) {
        rumbleShopItem = await new RumbleShopItem({
            _id: mongoose.Types.ObjectId(),
            name: name            
        })
    }

    rumbleShopItem.image = image
    rumbleShopItem.era = era

    await rumbleShopItem.save().catch(error => addLog(null, error, error.stack))
    return rumbleShopItem
}

async function removeRumbleShopItem(name) {
    let rumbleShopItem = await getRumbleShopItem(name)

    if (!rumbleShopItem) return

    try {
        await rumbleShopItem.delete()
    } catch (error) {
        addLog(null, error, error.stack)
    }
}

module.exports = {
    name: "rumbleshop",
    addRumbleShopItem,
    removeRumbleShopItem,
    getRumbleShopItem,
    getLastRefresh,
    setLastRefresh,
    setItemRefresh,
    getRumbleShopItems
}