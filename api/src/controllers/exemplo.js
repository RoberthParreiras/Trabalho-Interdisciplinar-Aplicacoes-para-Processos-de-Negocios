import express from "express";
import exemploService from "./services/exemploService.js";

const router = express.Router();

router.get('/', (req, res) => {
    
    // chama o service
    exemploService.algo;

});