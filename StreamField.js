// This is for the post shared on my blog: stackingtabs.medium.com
// My aim is to display the body streamfield filled with paragraphs, images, etc.  in React.
// This means the data (the paragraphs, images in body streamfield) has to be exposed over Wagtail v2 API and then consumed by React.


import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import DOMPurify from 'dompurify';


axios.defaults.baseURL = process.env.REACT_APP_API_URL

const BlogPage = () => {

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [body, setBody] = useState([]);
  const [image, setImage] = useState([]);
  const [paragraph, setParagraph] = useState([]);
  const { id } = useParams();

  const retrieveBody = async () => {

    try {
      setLoading(true)
      const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/v2/pages/?type=blog.Blog&fields=description,thumbnail,body&id=` + id)

        setData(result.data.items);
        setBody(result.data.items[0].body);
        setLoading(false);

        let html = [];
        for (let i = 0; i < body.length; i++) {          

        if (body[i].type === 'image') { 
            const results = await axios.get(`${process.env.REACT_APP_API_URL}/api/v2/images/` + body[i].value)
            .then(results => {                    
                setImage(results.data.meta.download_url)
            })
        }

        else if (body[i].type === 'paragraph') {
            html.push(
            <div>
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(body[i].value) }} />
            </div>
            );
            setParagraph(html)
        }
        }          
    }
    
    catch (err) {
      console.log(err);
    }

  };

  useEffect(() => {

    retrieveBody();

  }, [body.length]);



  
  if (loading) {
    return (
      <h4>
        <img src="https://i.pinimg.com/originals/48/6a/a0/486aa0fa1658b7522ecd8918908ece40.gif" />
      </h4>
    );
  } 

  
  
  return (
    <div>
        <img src={`${process.env.REACT_APP_API_URL}/${image}`} />
        
        <div>
        {data.map((data) => (
            <ul key={data.id}>
            {data.title} <br />
            {data.description}
            </ul>))}            
        </div>

        <div>
        {paragraph.map((paragraph) => (
        <ul>
            {paragraph}
        </ul>))}
        </div>
    </div>
  );
}

export default BlogPage;

// Code Explained
// 1.	Line 21: Loading set to true
// 2.	Line 22: Get data from api/v2/pages/…
// 3.	Line 22: Await until all data has arrived
// 4.	Lines 24, 25: Only then load data into Data using setData and Body using setBody
// There are two ways, try then/finally block or async/await, both of which work.
// For more, see https://stackoverflow.com/questions/70996079/async-await-on-axios 
// 5.	Line 26: Loading set to false
// 6.	Lines 28, 29: Set html to empty array and loop.
// a.	In this case, body.length is 2.
// b.	How to read REST API?
// c.	How to access body’s value?
// i.	How to access “body”? Topic: Nested API
// ii.	Nested object: Access object within object {}
// iii.	Nested array: Access object within array []
// iv.	Because body is an array of objects, body[0].value is used and not body.value
// 7.	Line 32: Then use the data in body, to get data from api/v2/images/…
// 8.	Lines 33, 34 : Set image with the download_url data from api/v2/images/…
// 9.	Line 76: Use this download_url as image source location.
// 10.	Lines 38-44: The value of <p> is in html format.
// •	DangerouslySetInnerHTML
// -	Inject HTML using html.push()
// -	Sanitise using DOMPurify.sanitize()
// -	Install using npm i dompurify
// -	DOMPurify.sanitize()
// -	Eg. <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(body[i].value) }} />
// 11.	Lines 86-92: Now paragraph is without html tags.
// 12.	Lines 78-84: Just title and description from setData(result.data.items) from Line 24.
// 13.	Lines 20, 49: Try-catch any error in case try part does not work.
// 14.	Line 55: useEffect