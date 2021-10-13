var express = require('express');
var router = express.Router();
const Scheme = require('../models/Scheme');
/* GET users listing. */

//! Use of Multer


router.post('/', function(req, res){
    console.log(req.body.fileName);
    // console.log(req.body);
    data = req.body.excel_data;
    dataHeaders = req.body.data_header;
    cond = req.body.condition_type;
    creditType = req.body.creditValue.creditType;
    creditValue = req.body.creditValue.creditValue;
    priceCondOperator = req.body.price_condition.operator;
    priceCondPrice = req.body.price_condition.price;
    start_date = new Date(req.body.start_date);
    end_date = new Date(req.body.end_date);
    base_date = new Date('1900-01-01');
    start_date_number = (start_date-base_date)/(1000 * 60 * 60 * 24)+2;
    end_date_number = (end_date-base_date)/(1000 * 60 * 60 * 24)+2;
    // console.log(req.body.excel_file);
    P = dataHeaders.price; 
    D = dataHeaders.date;
    var scheme_credit = 0;
    if(creditType === '%'){
        multiplyValue = creditValue/100;
        addValue = 0;
    }
    else if(creditType === 'Flat'){
        multiplyValue = 0;
        addValue = creditValue;
    }
    // console.log(active_mobile.P);

    if(cond==="No"){
        data.map((active_mobile)=>{
            if(active_mobile[D]>= start_date_number && active_mobile[D]<=end_date_number){dateMultiply = 1}
            else {dateMultiply=0}
            scheme_credit = scheme_credit + ((active_mobile[P])*multiplyValue + addValue)*dateMultiply;
        });
    }
    else if(cond === "Price_Condition"){

        data.map((active_mobile)=>{
            if(active_mobile[D]>= start_date_number && active_mobile[D]<=end_date_number){dateMultiply = 1}
            else {dateMultiply=0}
            if(priceCondOperator === ">="){
                if(active_mobile[P] >= priceCondPrice ){
                scheme_credit = scheme_credit + ((active_mobile[P])*multiplyValue + addValue)*dateMultiply;
                }
            }
            else if(priceCondOperator === "="){
                if(active_mobile[P] === priceCondPrice ){
                    scheme_credit = scheme_credit + ((active_mobile[P])*multiplyValue + addValue)*dateMultiply;
                }
            }
            else if(priceCondOperator === "<="){
                if(active_mobile[P] <= priceCondPrice ){
                    scheme_credit = scheme_credit + ((active_mobile[P])*multiplyValue + addValue)*dateMultiply;
                }
            }
        })
    } 
    // console.log(start_date_number);
    // console.log(end_date_number);
    // console.log(scheme_credit);
    req.body.creditNote = scheme_credit;
    const scheme = new Scheme(req.body);
    scheme.save(function(err){
        if(err) {
            console.log("err", err);
            res.status(400).send({
                message: err,
             });
        } else {
            res.send("Scheme added successfully");
        }
    });
});


router.get('/', function(req, res){
    Scheme.find({}, { __v: 0,excel_data: 0,data_header: 0 }, function(err,data){
        if(err) {
            console.log("err", err);
            res.status(400).send({
                message: err,
             });
        } else {
            res.send({results: data});
        }
    });
});

router.get('/:id', function(req, res){
    console.log(req.params.id);
    Scheme.findOne({_id:req.params.id}, { __v: 0,excel_data: 0,data_header: 0 }, function(err,data){
        if(err) {
            console.log("err", err);
            res.status(400).send({
                message: err,
             });
        } else {
            res.send({results: data});
        }
    });
});

router.put('/:id', function(req, res){
    Scheme.findOne({_id:req.params.id}, { __v: 0}, function(err,data){
        if(err) {
            console.log("err", err);
            res.status(400).send({
                message: err,
             });
        } else {
                console.log(req.body);
                dataHeaders = data.data_header;
                data = data.excel_data;
                console.log(dataHeaders);
                cond = req.body.condition_type;
                creditType = req.body.creditValue.creditType;
                creditValue = req.body.creditValue.creditValue;
                priceCondOperator = req.body.price_condition.operator;
                priceCondPrice = req.body.price_condition.price;
                start_date = new Date(req.body.start_date);
                end_date = new Date(req.body.end_date);
                base_date = new Date('1900-01-01');
                start_date_number = (start_date-base_date)/(1000 * 60 * 60 * 24)+2;
                end_date_number = (end_date-base_date)/(1000 * 60 * 60 * 24)+2;
                
                P = dataHeaders.price; 
                D = dataHeaders.date;
                var scheme_credit = 0;
                if(creditType === '%'){
                    multiplyValue = creditValue/100;
                    addValue = 0;
                }
                else if(creditType === 'flat'){
                    multiplyValue = 0;
                    addValue = creditValue;
                }
                // console.log(active_mobile.P);

                if(cond==="No"){
                    data.map((active_mobile)=>{
                        if(active_mobile[D]>= start_date_number && active_mobile[D]<=end_date_number){dateMultiply = 1}
                        else {dateMultiply=0}
                        scheme_credit = scheme_credit + ((active_mobile[P])*multiplyValue + addValue)*dateMultiply;
                    });
                }
                else if(cond === "Price_Condition"){

                    data.map((active_mobile)=>{
                        if(active_mobile[D]>= start_date_number && active_mobile[D]<=end_date_number){dateMultiply = 1}
                        else {dateMultiply=0}
                        if(priceCondOperator === ">="){
                            if(active_mobile[P] >= priceCondPrice ){
                            scheme_credit = scheme_credit + ((active_mobile[P])*multiplyValue + addValue)*dateMultiply;
                            }
                        }
                        else if(priceCondOperator === "="){
                            if(active_mobile[P] === priceCondPrice ){
                                scheme_credit = scheme_credit + ((active_mobile[P])*multiplyValue + addValue)*dateMultiply;
                            }
                        }
                        else if(priceCondOperator === "<="){
                            if(active_mobile[P] <= priceCondPrice ){
                                scheme_credit = scheme_credit + ((active_mobile[P])*multiplyValue + addValue)*dateMultiply;
                            }
                        }
                    })
                }
                Scheme.updateOne({_id:req.params.id},
                    {$set :{
                        name:req.body.name,
                        start_date:req.body.start_date,
                        end_date:req.body.end_date,
                        condition_type:req.body.condition_type,
                        creditNote:scheme_credit,
                        price_condition:req.body.price_condition,
                        creditValue:req.body.creditValue
                    }},
                    function(err,data){
                    if(err) {
                        console.log("err", err);
                        res.status(400).send({
                            message: err,
                         });
                    } else {
                        res.send("Scheme Updated Successfully");
                    }
                });
                // req.body.creditNote = scheme_credit;
        }
    });

});

router.delete('/', function(req, res){
    Scheme.deleteMany({}, { __v: 0 }, function(err,data){
        if(err) {
            console.log("err", err);
            res.status(400).send({
                message: err,
             });
        } else {
            res.send("All data deleted successfully");
        }
    });
});

router.delete('/:id', function(req, res){
    Scheme.deleteMany({_id:req.params.id}, { __v: 0 }, function(err,data){
        if(err) {
            console.log("err", err);
            res.status(400).send({
                message: err,
             });
        } else {
            res.send("Scheme deleted successfully");
        }
    });
});
module.exports = router;
