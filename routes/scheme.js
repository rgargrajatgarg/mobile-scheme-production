var express = require('express');
var router = express.Router();
const Scheme = require('../models/Scheme');
/* GET users listing. */

//! Use of Multer

function compareOperator(a,b,operator){
    if(operator=== "=")
    return (a===b);
    else if (operator === ">=")
    return (a>=b);
    else if(operator === "<=")
    return (a<=b);
    else return false;
}
function compareModel(model,modelList){
    console.log("Compare Model Called");
    console.log(modelList);
    console.log(model);
    // return true;
    console.log(modelList.includes(model));
    return modelList.includes(model);
}
function calcCreditNote(props){
    data = props.excel_data;
    dataHeaders = props.data_header;
    cond = props.condition_type;
    creditType = props.creditValue.creditType;
    model_condition = props.model_condition;
    console.log(model_condition);
    creditValue = Number(props.creditValue.creditValue);
    priceCondOperator = props.price_condition.priceOperator;
    priceCondPrice = props.price_condition.condValue;
    start_date = new Date(props.start_date);
    end_date = new Date(props.end_date);
    base_date = new Date('1900-01-01');
    start_date_number = (start_date-base_date)/(1000 * 60 * 60 * 24)+2;
    end_date_number = (end_date-base_date)/(1000 * 60 * 60 * 24)+2;
    P = dataHeaders.price; 
    D = dataHeaders.date;
    M = dataHeaders.model;
    var scheme_credit = 0;
    var ct_mobile = 0;
    var total_sales = 0;
    if(creditType === '%'){
        multiplyValue = (creditValue/1.18)/100;
        addValue = 0;
    }
    else if(creditType === 'flat'){
        multiplyValue = 0;
        addValue = creditValue;
    }
    dataDate = data.filter(item => (item[D] >=  start_date_number && item[D] <= end_date_number));
    dataDate.map((active_mobile)=>{
        if(cond==="No" || 
        (cond==="Price_Condition" && compareOperator(active_mobile[P],priceCondPrice,priceCondOperator)) || 
        (cond==="Model_Condition" && compareModel(active_mobile[M],model_condition))
            ){
            scheme_credit = scheme_credit + ((active_mobile[P])*multiplyValue + addValue);
            ct_mobile++;
            total_sales = active_mobile[P] + total_sales;
        }
    });
    return [scheme_credit,ct_mobile,total_sales];

}
router.post('/', function(req, res){
    scheme_credit = [];
    ct_mobile = [];
    total_sales = [];
    excel_data = req.body.excel_data;
    dataHeaders = req.body.data_header;
    
    for (let i = 0; i < req.body.name.length; i++) {
        var params = req;
        params.excel_data = excel_data;
        params.data_header = dataHeaders;
        params.condition_type = req.body.condition_type[i];
        params.creditValue = req.body.creditValue[i];
        params.model_condition = req.body.model_condition[i];
        params.price_condition = req.body.price_condition[i];
        params.start_date = req.body.start_date[i];
        params.end_date = req.body.end_date[i];
        var calc = calcCreditNote(params);
        scheme_credit.push(calc[0]);
        ct_mobile.push(calc[1]);
        total_sales.push(calc[2]);
    }
    req.body.creditNote = scheme_credit;
    req.body.ctMobile = ct_mobile;
    req.body.totalSale = total_sales;
    console.log(scheme_credit);
    const scheme = new Scheme(req.body);
    scheme.save(function(err){
        if(err) {
            console.log("err", err);
            console.log("heyy");
            res.status(400).send({
                message: err,
             });
        } else {
            console.log("Scheme Added Succes");
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

router.get('/admin/', function(req, res){
    Scheme.find({}, { __v: 0 }, function(err,data){
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
                new_req = req;
                new_req.body.data_header = data.data_header;
                new_req.body.excel_data = data.excel_data; 
                calcParams = calcCreditNote(new_req);
                req.body.creditNote = calcParams[0];
                req.body.ctMobile = calcParams[1];
                req.body.totalSale = calcParams[2];
                Scheme.updateOne({_id:req.params.id},
                    {$set :{
                        name:req.body.name,
                        start_date:req.body.start_date,
                        end_date:req.body.end_date,
                        condition_type:req.body.condition_type,
                        creditNote:scheme_credit,
                        price_condition:req.body.price_condition,
                        creditValue:req.body.creditValue,
                        ctMobile:req.body.ctMobile,
                        totalSale:req.body.totalSale
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
