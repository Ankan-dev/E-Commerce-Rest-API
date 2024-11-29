const Collection = require('../models/collection-model.js')

const createCollection = async (req, res) => {
    const { collectionName, description } = req.body
    if (!collectionName) {
        return res.status(404)
            .json({
                message: "Collection name is missing, please provide the name of the collection",
                success: false
            })
    }

    try {
        const createCol = await Collection.create({ Title: collectionName, description: description });
        if (!createCol) {
            return res.status(500)
                .json({
                    message: "The collection couldn't be created",
                    success: false
                })
        }

        return res.status(201)
            .json({
                message: "The collection has been created successfully",
                success: true
            })

    } catch (error) {
        console.log(error.message)
        return res.status(500)
            .json({
                message: "Internal server error in creating collection",
                error: error.message,
                success: false
            })
    }

}

const getAllCollection = async (req, res) => {
    try {
        const getCollections = await Collection.find();
        if (!getCollections) {
            return res.status(500)
                .json({
                    message: "The collection couldn't be fetched",
                    success: false
                })
        }

        return res.status(200)
            .json({
                message: "The collection has been fetched successfully",
                data: getCollections,
                success: true
            })
    } catch (error) {
        return res.status(500)
            .json({
                message: "Internal server error in getting all collections",
                error: error.message,
                success: false
            })
    }
}


const getCollectionById = async (req, res) => {

    const { id } = req.params;
    if (!id) {
        return res.status(404)
            .json({
                message: "The id of collection is missing",
                success: false
            })
    }
    try {
        const getCollections = await Collection.findById(id);
        if (!getCollections) {
            return res.status(500)
                .json({
                    message: "The collection couldn't be fetched",
                    success: false
                })
        }

        return res.status(200)
            .json({
                message: "The collection has been fetched successfully",
                data: getCollections,
                success: true
            })
    } catch (error) {
        return res.status(500)
            .json({
                message: "Internal server error in getting collections by id",
                error: error.message,
                success: false
            })
    }
}


const updateCollection = async (req, res) => {
    const collection_id = req.body.id;
    const name = req.body.name;
    const description = req.body.description;
    if (!collection_id) {
        return res.status(404)
            .json({
                message: "collection id is missing",
                success: false
            })
    }

    try {
        const getCollection = await Collection.findById(collection_id);

        if (!getCollection) {
            return res.status(200)
                .json({
                    message: "Collection not found",
                    success: false
                })
        }

        if (name && description) {
            getCollection.Title = name;
            getCollection.description = description
        } else if (name) {
            getCollection.Title = name;
        } else if (description) {
            getCollection.description = description
        } else {
            return res.status(404)
                .json({
                    message: "update credentials are missing",
                    success: false
                })
        }

        await getCollection.save();

        return res.status(200)
            .json({
                message: "The updates have been saved",
                success: true
            })
    } catch (error) {
        return res.status(500)
            .json({
                message: "Internal server error in update collection",
                success: false
            })
    }

}

const deleteCollection = async (req, res) => {
    const collectionId=req.body.id
    if (!collectionId) {
        return res.status(404)
            .json({
                message: "collection id is missing",
                success: false
            })
    }

    try {
        const deleteStatus=await Collection.deleteOne({_id:collectionId});
        if(deleteStatus.deletedCount === 0){
            return res.status(500)
            .json({
                message: "Internal server error in delete collection",
                success: true
            }) 
        }
        return res.status(200)
        .json({
            message: "The collection has been deleted successfully",
            success: true
        })
    } catch (error) {
        return res.status(500)
            .json({
                message: "Internal server error in delete collection",
                success: false
            })
    }
}

module.exports = { createCollection, getAllCollection, getCollectionById, updateCollection, deleteCollection }
