const axios  = require("axios");

async function getSomeInfoFromRJACApplication(){

   
    try{

       const responses = await Promise.all(
        [
            await axios.get('https://coral-app-3zp7d.ondigitalocean.app/api/products'),
            // await axios.get('https://oyster-app-f6s5e.ondigitalocean.app/api/gratuityprojects')
           
            await axios.get(' http://localhost:8000/api/gratuityprojects'),
           
        
        ]
       )


       const [prod,grad]=responses
       const prodData=prod.data
       const gradData = grad.data

        // const response = await axios?.get(
            
        //     'https://oyster-app-f6s5e.ondigitalocean.app/api/gratuityprojects'
        // )

        
         
       

        
        
        //  return response?.data
        return{
            prodData,
            gradData
        }
    }catch(error){
        console.log(error);
        throw error
    }
}

exports.getSomeInfo = async(req,res)=>{
    const id = req.params.id
    try{
        const {gradData} = await getSomeInfoFromRJACApplication()
        
        const gradinfo = await gradData.find(item=>item?.client?.totalConnect_id===id)
      
        if (gradinfo){
            // const data ={
            //     one :gradinfo?.company?.company_name
            // }
            // console.log("data :-",data)
            res.status(200).json({msg:"Successfully Fetched From Rjac",gradinfo})
        }else{
           
            res.status(404).json({ error: "Info not found" });
        }
        
    
    }catch(error){
      
        res.status(500).json({ error: "Internal Server Error" });
    }
}