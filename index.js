
const express= require("express")
const { MongoClient, ServerApiVersion } = require('mongodb');
// const SSLCommerzPayment = require('sslcommerz')
const { v4: uuidv4 } = require("uuid");
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config();
const cors = require("cors");

const app=express();
const port = process.env.PORT || 5000;
const SSLCommerzPayment = require('sslcommerz')
// app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.utq7asn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try{
        await client.connect();
        console.log("connected to database");
        const database = client.db('e-commerce');
        const buyerCollection = database.collection('buyerProduct');
        const potterCollection = database.collection('buyerPotter');
        const userCollection = database.collection('users');
        const likeCollection = database.collection('like');
        const paymentCollection = database.collection('payment');
        const adminPaymentCollection = database.collection('Adminpaymentdata');
        const featuresCollection = database.collection('features');
        const fashionCollection = database.collection('fashion');
        const userReviewCollection = database.collection('reviewCollected');
        const adminUploadProductCollection = database.collection('adminProducts');
        const adminUploadPotterCollection = database.collection('adminPotter');
        const feedbacksCollection = database.collection('userfeedbacks');
        const DesignCollection = database.collection('designUser');


        
    //    post product buyer 
        app.post('/postBuyer', async(req,res) =>{
            const user=req.body;
          console.log(user);
          
            const result=await buyerCollection.insertOne(user);
            res.json(result)
        });

        app.get('/postBuyer', async(req,res)=>{
            const result=await buyerCollection.find({}).toArray()
            res.json(result)
        });

        // admin post product to database 
        //    post product buyer 
        app.post('/postadminProduct', async(req,res) =>{
            const user=req.body;
          console.log(user);
          
            const result=await adminUploadProductCollection.insertOne(user);
            res.json(result)
        });

        // app.get('/getAdmin', async(req,res)=>{
        //     const result=await buyerCollection.find({}).toArray()
        //     res.json(result)
        // });


        // admin all product show to ui 
        // get sharee 
    app.get("/adminShowproduct", async (req, res) => {
        const page = req.query.page;
        const size = parseInt(req.query.size);
        const query = req.query;
        delete query.page
        delete query.size
        Object.keys(query).forEach(key => {
            if (!query[key])
                delete query[key]
        });

        if (Object.keys(query).length) {
            const cursor = adminUploadProductCollection.find(query, status = "approved");
            const count = await cursor.count()
            const allQuestions = await cursor.skip(page * size).limit(size).toArray()
            res.json({
                allQuestions, count
            });
        } else {
            const cursor = adminUploadProductCollection.find({
                // status: "approved"
            });
            const count = await cursor.count()
            const allQuestions = await cursor.skip(page * size).limit(size).toArray()

            res.json({
                allQuestions, count
            });
        }

    });

        // potter post 

        app.post('/postPotter', async(req,res) =>{
            const user=req.body;
          console.log(user)
            // console.log(like)
            const result=await potterCollection.insertOne(user);
            res.json(result)
        });

        // userdesignorder 
        app.post('/userDesign', async(req,res) =>{
            const user=req.body;
          console.log(user)
            // console.log(like)
            const result=await DesignCollection.insertOne(user);
            res.json(result)
        });

        // getuserdesign 
        app.get('/userDesign', async(req,res)=>{
            const result=await DesignCollection.find({}).toArray()
            res.json(result)
        });

        // get potter 

        app.get("/getPotter", async (req, res) => {
            const page = req.query.page;
            const size = parseInt(req.query.size);
            const query = req.query;
            delete query.page
            delete query.size
            Object.keys(query).forEach(key => {
                if (!query[key])
                    delete query[key]
            });
    
            if (Object.keys(query).length) {
                const cursor = potterCollection.find(query, status = "approved");
                const count = await cursor.count()
                const allQuestions = await cursor.skip(page * size).limit(size).toArray()
                res.json({
                    allQuestions, count
                });
            } else {
                const cursor = potterCollection.find({
                    // status: "approved"
                });
                const count = await cursor.count()
                const allQuestions = await cursor.skip(page * size).limit(size).toArray()
    
                res.json({
                    allQuestions, count
                });
            }
    
        });


        // admin potter product upload 
        // potter post 

        app.post('/adminsPotter', async(req,res) =>{
            const user=req.body;
          console.log(user)
            // console.log(like)
            const result=await adminUploadPotterCollection.insertOne(user);
            res.json(result)
        });


        // feedback 
        app.post('/feedbacks', async(req,res) =>{
            const user=req.body;
          console.log(user)
            // console.log(like)
            const result=await feedbacksCollection.insertOne(user);
            res.json(result)
        });
        // feedback 
        app.get('/feedback', async(req,res)=>{
            const result=await feedbacksCollection.find({}).toArray()
            res.json(result)
        });


      

       
        

         // update product

    // app.put('/updateProduct/:id', async(req,res)=>{
    //     const  id= req.params.id;
    //     const updateUser=req.body;
    //     const filter={_id: ObjectId(id)};
    //     const options={upsert:true};

    //     const updateDoc={
    //         $set:{
    //             productName:updateUser.productName
    //             // ProductPrice:ProductPrice
    //         }
    //     }
    //     const result=await potterCollection.updateOne(filter,updateDoc,options);
    //     res.json(result)
    // })

    // buyersharee update 

    app.put("/updateProduct/:id", async (req, res) => {

        const id=req.params.id;
        const updateUser=req.body
        console.log(updateUser)
        const filter={_id: ObjectId(id)};
        const options={upsert:true};

        const updateDoc={
            $set:{
                productName:updateUser.productName,
                ProductPrice:updateUser.ProductPrice
            }
        }
        const result=await buyerCollection.updateOne(filter,updateDoc,options);
        console.log('uodateinf',id);
        res.json(result)

    })

    app.get('/update/:id', async(req,res)=>{
        const id=req.params.id;
        const query={_id:ObjectId(id)};
        const user=await buyerCollection.findOne(query)
        res.json(user)
    })
   


     // buyerpottery update 

     app.put("/updatePotter/:id", async (req, res) => {

        const id=req.params.id;
        const updateUser=req.body
        console.log(updateUser)
        const filter={_id: ObjectId(id)};
        const options={upsert:true};

        const updateDoc={
            $set:{
                productName:updateUser.productName,
                ProductPrice:updateUser.ProductPrice
            }
        }
        const result=await potterCollection.updateOne(filter,updateDoc,options);
        console.log('uodateinf',id);
        res.json(result)

    });
     // schedule update 

     app.put("/updatesSchedules/:id", async (req, res) => {

        const id=req.params.id;
        const updateUser=req.body
        console.log(updateUser)
        const filter={_id: ObjectId(id)};
        const options={upsert:true};

        const updateDoc={
            $set:{
                schedules:updateUser.schedules,
                // purchase:updateUser.purchase
            }
        }
        const result=await paymentCollection.updateOne(filter,updateDoc,options);
        console.log('uodateinf',id);
        res.json(result)

    })
     // schedule update 

     app.put("/updatesPurchase/:id", async (req, res) => {

        const id=req.params.id;
        const updateUser=req.body
        console.log(updateUser)
        const filter={_id: ObjectId(id)};
        const options={upsert:true};

        const updateDoc={
            $set:{
                // schedules:updateUser.schedules,
                purchase:updateUser.purchase
            }
        }
        const result=await paymentCollection.updateOne(filter,updateDoc,options);
        console.log('uodateinf',id);
        res.json(result)

    })

    app.get('/potter/:id', async(req,res)=>{
        const id=req.params.id;
        const query={_id:ObjectId(id)};
        const user=await potterCollection.findOne(query)
        res.json(user)
    })
   
    app.get('/showpay/:id', async(req,res)=>{
        const id=req.params.id;
        const query={_id:ObjectId(id)};
        const user=await paymentCollection.findOne(query)
        res.json(user)
    })
   
     

        // details show product 
        app.get('/product/:id', async(req,res)=>{
            const id=req.params.id
            const query={_id:ObjectId(id)}
            const result=await buyerCollection.findOne(query)
            res.json(result)
        });
        // details show admin product 
        app.get('/details/:id', async(req,res)=>{
            const id=req.params.id
            const query={_id:ObjectId(id)}
            const result=await adminUploadProductCollection.findOne(query)
            res.json(result)
        });
        // details show admin product 
        app.get('/potterdetails/:id', async(req,res)=>{
            const id=req.params.id
            const query={_id:ObjectId(id)}
            const result=await potterCollection.findOne(query)
            res.json(result)
        });


          // add database user collection 
          app.post('/users', async(req,res)=>{
            const user=req.body;
            console.log(user)
            const result=await userCollection.insertOne(user);
            // console.log(body)
            res.json(result);
           
        })

        app.get('/users', async(req,res)=>{
            const result=await userCollection.find({}).toArray()
            res.json(result)
        });
          // add database user collection 
          app.get('/users', async(req,res)=>{
            const user=req.body;
            console.log(user)
            const result=await userCollection.insertOne(user);
            // console.log(body)
            res.json(result);
           
        })

        

        app.put('/users', async(req,res) =>{
            const user=req.body;
            console.log(user)
            const filter= {email:user.email}
            const option = {upsert:true}
            const updateDoc= {$set : user}
            const result= await userCollection.updateOne(filter,updateDoc,option)
            res.json(result)
        });

        // database searching check buyer
    app.get('/users/:email', async(req,res)=>{
        const email=req.params.email;
        const query={email:email}
        const user=await userCollection.findOne(query)
        let isbuyer=false;
        if(user?.client==='buyer'){
          isbuyer=true;
        }
        res.json({buyer:isbuyer})
    });
        // database searching check buyers
    app.get('/user/:email', async(req,res)=>{
        const email=req.params.email;
        const query={email:email}
        const user=await userCollection.findOne(query)
        let isbuyers=false;
        if(user?.client==='buyers'){
          isbuyers=true;
        }
        res.json({buyers:isbuyers})
    });
       
    // database admin role 
    app.put('/userLogin/admin', async(req,res)=>{
        const user=req.body;
        console.log('put',user)
        const filter={email:user.email}
        const updateDoc={$set:{role:'admin'}}
        const result=await userCollection.updateOne(filter,updateDoc)
        res.json(result)
    });

       // database searching check admin 
       app.get('/userLogin/:email', async(req,res)=>{
        const email=req.params.email;
        const query={email:email}
        const user=await userCollection.findOne(query)
        let isAdmin=false;
        if(user?.role==='admin'){
          isAdmin=true;
        }
        res.json({admin:isAdmin})
    });

    // update profile 

    app.put('/updateUser', async(req,res)=>{
        const user=req.body;
        const query={email:user.email}
        const updateDoc={
            $set:{
                address:user.address,
                mobile:user.mobile
            }
        }
        const result=await userCollection.updateOne(query,updateDoc);
        res.json(result)
    })
    // update schedule

    app.put('/updateSchedule', async(req,res)=>{
        const user=req.body;
        console.log(user)
        const query={email:user.email}
        const updateDoc={
            $set:{
                schedules:user.schedules,
                // mobile:user.mobile
            }
        }
        const result=await paymentCollection.updateOne(query,updateDoc);
        res.json(result)
    })

      // user profile email 
      app.get('/updateUser/:email', async(req,res)=>{
        const email=req.params.email;
        const query={email:email};
        const result=await userCollection.findOne(query)
        res.json(result)
    });
      // user profile email 
      app.get('/userupdateUser/:email', async(req,res)=>{
        const email=req.params.email;
        const query={email:email};
        const result=await userCollection.findOne(query)
        res.json(result)
    });
    // design part 
    // post review part 

        //  post review the database 
    app.post("/review", async (req, res) => {
        const review = req.body;
        const result = await userReviewCollection.insertOne(review);
        res.json(result);
    });
   


        // get resview 
    app.get('/review', async(req,res)=>{
        const result=await userReviewCollection.find({}).toArray()
        res.json(result)
    })


    // update schedule data 
      // database admin role 
      app.put('/schedule/:id', async(req,res)=>{
        const users=req.body.date;
        console.log('put',users)
        const id=(req.params.id)
        console.log(id)
       
    });


    // get sharee 
    app.get("/sharee", async (req, res) => {
        const page = req.query.page;
        const size = parseInt(req.query.size);
        const query = req.query;
        delete query.page
        delete query.size
        Object.keys(query).forEach(key => {
            if (!query[key])
                delete query[key]
        });

        if (Object.keys(query).length) {
            const cursor = buyerCollection.find(query, status = "approved");
            const count = await cursor.count()
            const allQuestions = await cursor.skip(page * size).limit(size).toArray()
            res.json({
                allQuestions, count
            });
        } else {
            const cursor = buyerCollection.find({
                // status: "approved"
            });
            const count = await cursor.count()
            const allQuestions = await cursor.skip(page * size).limit(size).toArray()

            res.json({
                allQuestions, count
            });
        }

    });


    app.get("/buyerproducts/:email", async (req, res) => {
        // const buyeremail=req.body.cartProducts.map((data)=>data.buyerEmail)
        console.log(req.params.email);
        const email = req.params.email;
        const result = await buyerCollection
          .find({ buyerEmail: email })
          .toArray();
          console.log(result)
        res.send(result);
      });


    //   potter upload 
    app.get("/potterproducts/:email", async (req, res) => {
        // const buyeremail=req.body.cartProducts.map((data)=>data.buyerEmail)
        console.log(req.params.email);
        const email = req.params.email;
        const result = await potterCollection
          .find({ buyerEmail: email })
          .toArray();
          console.log(result)
        res.send(result);
      });







    // delete book 
    app.delete('/deleteProduct/:id',async(req,res)=>{
        const result= await buyerCollection.deleteOne({_id:ObjectId(req.params.id)});
        res.json(result)
    });

    // delete potter 
    // delete book 
    app.delete('/deletePotter/:id',async(req,res)=>{
        const result= await potterCollection.deleteOne({_id:ObjectId(req.params.id)});
        res.json(result)
    });

    // delete admin product
    // delete admin product
    app.delete('/deleteadmin/:id',async(req,res)=>{
        const result= await adminUploadProductCollection.deleteOne({_id:ObjectId(req.params.id)});
        res.json(result)
    });


    app.put("/BlogStatusUpdate/:id", async (req, res) => {
     console.log(req.body.date)
        const filter = { _id: ObjectId(req.params.id) };

        const result = await buyerCollection.updateOne(filter, {
            $set: {
                schedule: req.body.date,
            },
        });
        res.send(result);
    });


    //sslcommerz init


    // const likes=[{type:ObjectId}]
    // app.put('/buyer/:id',async(req,res)=>{
    //     const id=req.params.id;
    //     const like=req.body;
    //     const query={_id:ObjectId(id)}
        
    //     const updateDoc=[{
    //       $set:{
    //        {like:req.user._id}
    //       }
    //     }]
    //     const result=await buyerCollection.updateOne(query,updateDoc)
    //     res.json(result)
    //   })


   


     // ================================Like in post====================================================
        //Link post----------------------------------------------------------------------------------------
        app.put('/like/:id', async (req, res) => {
            try {
                // console.log(req.body)
                const filter = { _id: ObjectId(req.params.id) };
                const post = await buyerCollection.findOne(filter);
                const check = post?.likes?.filter(like => like?.email?.toString() === req?.body?.email).length;
                if (!check) {
                    const options = { upsert: true };
                    const updateDoc = { $push: { likes: req.body } };
                    const result = await buyerCollection.updateOne(filter, updateDoc, options);
                    res.status(200).json(result)
                } else {
                    return res.status(400).json({ massage: "Post has not yet been liked" });
                }

            } catch (err) {
                res.status(500).send('Server Error')
            }

        })




            //unLink post-----------------------------------------------------------------------------------------
            app.put('/unlike/:id', async (req, res) => {
                try {
                    const filter = { _id: ObjectId(req.params.id) };
                    const post = await buyerCollection.findOne(filter);
                    const check = post?.likes?.filter(like => like?.email?.toString() === req?.body?.email).length;
                    if (check) {
                        const removeIndex = post?.likes?.filter(like => like.email.toString() !== req.body.email);
                        const options = { upsert: true };
                        const updateDoc = { $set: { likes: removeIndex } };
                        const result = await buyerCollection.updateOne(filter, updateDoc, options);
                        res.status(200).json(result,)
                    } else {
                        return res.status(400).json({ massage: "Post has not yet been liked" });
                    }
                } catch (err) {
                    res.status(500).send('Server Error')
                }
            })
    
    // =======================================================================================================================
    
    //   like post potter 
    //Link post----------------------------------------------------------------------------------------
    app.put('/potterlike/:id', async (req, res) => {
        try {
            // console.log(req.body)
            const filter = { _id: ObjectId(req.params.id) };
            const post = await potterCollection.findOne(filter);
            const check = post?.likes?.filter(like => like?.email?.toString() === req?.body?.email).length;
            if (!check) {
                const options = { upsert: true };
                const updateDoc = { $push: { likes: req.body } };
                const result = await potterCollection.updateOne(filter, updateDoc, options);
                res.status(200).json(result)
            } else {
                return res.status(400).json({ massage: "Post has not yet been liked" });
            }

        } catch (err) {
            res.status(500).send('Server Error')
        }

    })


    app.put('/potterunlike/:id', async (req, res) => {
        try {
            const filter = { _id: ObjectId(req.params.id) };
            const post = await potterCollection.findOne(filter);
            const check = post?.likes?.filter(like => like?.email?.toString() === req?.body?.email).length;
            if (check) {
                const removeIndex = post?.likes?.filter(like => like.email.toString() !== req.body.email);
                const options = { upsert: true };
                const updateDoc = { $set: { likes: removeIndex } };
                const result = await potterCollection.updateOne(filter, updateDoc, options);
                res.status(200).json(result,)
            } else {
                return res.status(400).json({ massage: "Post has not yet been liked" });
            }
        } catch (err) {
            res.status(500).send('Server Error')
        }
    })


     // ================================Like in post admin====================================================
        //Link post----------------------------------------------------------------------------------------
        app.put('/adminlike/:id', async (req, res) => {
            try {
                // console.log(req.body)
                const filter = { _id: ObjectId(req.params.id) };
                const post = await adminUploadProductCollection.findOne(filter);
                const check = post?.likes?.filter(like => like?.email?.toString() === req?.body?.email).length;
                if (!check) {
                    const options = { upsert: true };
                    const updateDoc = { $push: { likes: req.body } };
                    const result = await adminUploadProductCollection.updateOne(filter, updateDoc, options);
                    res.status(200).json(result)
                } else {
                    return res.status(400).json({ massage: "Post has not yet been liked" });
                }

            } catch (err) {
                res.status(500).send('Server Error')
            }

        });

          //admin unLink post-----------------------------------------------------------------------------------------
          app.put('/adminunlike/:id', async (req, res) => {
            try {
                const filter = { _id: ObjectId(req.params.id) };
                const post = await adminUploadProductCollection.findOne(filter);
                const check = post?.likes?.filter(like => like?.email?.toString() === req?.body?.email).length;
                if (check) {
                    const removeIndex = post?.likes?.filter(like => like.email.toString() !== req.body.email);
                    const options = { upsert: true };
                    const updateDoc = { $set: { likes: removeIndex } };
                    const result = await adminUploadProductCollection.updateOne(filter, updateDoc, options);
                    res.status(200).json(result,)
                } else {
                    return res.status(400).json({ massage: "Post has not yet been liked" });
                }
            } catch (err) {
                res.status(500).send('Server Error')
            }
        })

// =======================================================================================================================




    //sslcommerz init
app.post('/init', async(req, res) => {
    // console.log(req.body)
    const email=req.body.cartProducts.map((data)=>data.buyerEmail)
    const schedule=req.body.cartProducts.map((data)=>data.schedule)
    const adminemail=req.body.cartProducts.map((data)=>data.adminEmail)
    console.log(email)
    console.log(schedule)
    const data = {
        emails:email,
        admindata:adminemail,
        total_amount: req.body.total_amount,
        currency: req.body.currency,
        tran_id: uuidv4(),
        success_url: 'http://localhost:5000/success',
        fail_url: 'http://localhost:5000/fail',
        cancel_url: 'http://localhost:5000/cancel',
        ipn_url: 'http://yoursite.com/ipn',
        shipping_method: 'Courier',
        product_name: "req.body.product_name",
        product_category: 'Electronic',
        product_profile: "req.body.product_profile",
        cus_name: req.body.cus_name,
        cus_email: req.body.cus_email,
        date: req.body.date,
        
        status: req.body.status,
        cartProducts: req.body.cartProducts,
        // buyerDetails: req.body.email,
        // buyerDetails: req.body.console.log(cartProducts),
        product_image: "https://i.ibb.co/t8Xfymf/logo-277198595eafeb31fb5a.png",
        cus_add1: req.body.cus_add1,
        cus_add2: 'Dhaka',
        cus_city: req.body.cus_city,
        schedules: req.body.schedules,
        purchase: req.body.purchase,
        cus_state:  req.body.cus_state,
        cus_postcode: req.body.cus_postcode,
        cus_country: req.body.cus_country,
        cus_phone: req.body.cus_phone,
        cus_fax: '01711111111',
        ship_name: 'Customer Name',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
        multi_card_name: 'mastercard',
        value_a: 'ref001_A',
        value_b: 'ref002_B',
        value_c: 'ref003_C',
        value_d: 'ref004_D'
    };
    // insert order data into database 
    const order=await paymentCollection.insertOne(data)
    console.log(data)
    const sslcommer = new SSLCommerzPayment(process.env.STORE_ID,process.env.STORE_PASSWORD,false) //true for live default false for sandbox
    sslcommer.init(data).then(data => {
        //process the response that got from sslcommerz 
        //https://developer.sslcommerz.com/doc/v4/#returned-parameters
        // console.log(data);
        // res.redirect(data.GatewayPageURL)
        if(data.GatewayPageURL){
            res.json(data.GatewayPageURL)
          }
          else{
            return res.status(400).json({
              message:'payment session failed'
            })
          }
    });
})

app.post('/success',async(req,res)=>{
    // console.log(req.body)
    const order = await paymentCollection.updateOne({tran_id:req.body.tran_id},{
        $set:{
          val_id:req.body.val_id
        }
    
      })
    res.status(200).redirect(`http://localhost:3000/success/${req.body.tran_id}`)
    // res.status(200).json(req.body)
})

app.post ('/fail', async(req,res)=>{
    // console.log(req.body);
  const order=await paymentCollection.deleteOne({tran_id:req.body.tran_id})
    res.status(400).redirect('http://localhost:3000')
  })
  app.post ('/cancel', async(req,res)=>{
    // console.log(req.body);
    const order=await paymentCollection.deleteOne({tran_id:req.body.tran_id})
    res.status(200).redirect('http://localhost:3000')
  })


  app.get('/orders/:tran_id', async(req,res)=>{
    const id=req.params.tran_id;
    const order =await paymentCollection.findOne({tran_id:id});
    console.log(order)
    res.json(order)
  });












//   client order and single mail 
// email get my Order==============================================
 // get myorder 
 app.get("/myOrder/:email", async (req, res) => {
    // const buyeremail=req.body.cartProducts.map((data)=>data.buyerEmail)
    console.log(req.params.email);
    const email = req.params.email;
    const result = await paymentCollection
      .find({ cus_email: email })
      .toArray();
    res.send(result);
  });
 app.get("/my/:email", async (req, res) => {
    // const buyeremail=req.body.emails.map((data)=>data.buyerEmail)
    // console.log(emails)
    // console.log(req.params.email);
    const email = req.params.email;
    console.log(email)
    const result = await paymentCollection
      .find({ emails: email })
      .toArray();
    res.send(result);
  });

  // get admin page myorder 
  app.get("/userMy/:email", async (req, res) => {
    // const buyeremail=req.body.emails.map((data)=>data.buyerEmail)
    // console.log(emails)
    // console.log(req.params.email);
    const email = req.params.email;
    console.log(email)
    const result = await paymentCollection
      .find({ admindata: email })
      .toArray();
    res.send(result);
  });

  //   delete api myorder 
//   app.delete('/deleteOrder/:id', async(req,res)=>{
//     const result=await myOrderCollection.deleteOne({_id:ObjectId(req.params.id)});
//     res.json(result)
// })

  // my order delete ----------
// Delete manage all product ----------
app.delete("/manageAllOrderDelete/:id", async (req, res) => {
    const result = await paymentCollection.deleteOne({_id:ObjectId(req.params.id)});
    res.send(result);
  });


//   post features product 
//    post product buyer 
// app.post('/PostFeatures', async(req,res) =>{
//     const user=req.body;
//   console.log(user);
  
//     const result=await featuresCollection.insertOne(user);
//     res.json(result)
// });
app.post('/datacollect',async(req,res)=>{
    const value=req.body;
    console.log(value)
    const output=await featuresCollection.insertOne(value);
    res.json(output)
});

app.post('/features',async(req,res)=>{
    const value=req.body;
    console.log(value)
    const output=await featuresCollection.insertOne(value);
    res.json(output)
});

app.get('/features', async(req,res)=>{
    const result=await featuresCollection.find({}).toArray()
    res.json(result)
});

app.post('/fashion',async(req,res)=>{
    const value=req.body;
    console.log(value)
    const output=await fashionCollection.insertOne(value);
    res.json(output)
});

app.get('/fashion', async(req,res)=>{
    const result=await fashionCollection.find({}).toArray()
    res.json(result)
});

// buyer status update 

 app.put("/buyerStatusUpdate/:id", async (req, res) => {
    // console.log(req.body)

    const filter = { _id: ObjectId(req.params.id) };
    
    const result = await userCollection.updateOne(filter, {
        $set: {
            client: req.body.statu,
        },
        
    });
    // console.log(result)
    res.send(result);
});


// delete user 
app.delete('/deleteUser/:id', async(req,res)=>{
    const result=await userCollection.deleteOne({_id:ObjectId(req.params.id)});
    // res.json(result)
});



// buyer check and admin confarm 
app.get('/adminConfarm', async(req,res)=>{
    const result=await userCollection.find({}).toArray()
    res.json(result)
});

 // upadate status for put api 
 app.put('/updateStatus/:id', async(req,res)=>{
    const id=req.params.id;
    const updateDoc=req.body.status;
    console.log(updateDoc)
    console.log(updateDoc)
    const filter={_id:ObjectId(id)}
    const result=await paymentCollection.updateOne(filter,{
        $set:{status:updateDoc}
    })
    res.json(result)
});


       

    }

    finally{
        // await client.close();
    }
}

run().catch(console.dir)


app.get('/', (req,res)=>{
    res.send("online shopping");
   });

   app.listen(port, ()=>{
    console.log("runnning online on port", port);
  }); 