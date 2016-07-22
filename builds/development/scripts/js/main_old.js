//*******************************************************************//
//*******************************************************************//
// Author : Jason R. Haddix
// Date : June / 2016 
// Liscence : 
/*
MIT License

Copyright (c) [year] [fullname]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/


//*******************************************************************//
//*******************************************************************//
// VARIABLES
//*******************************************************************//
//*******************************************************************//

// THREEJS //
var container;
var camera, scene, renderer;
var jsonLoader;
var meshPlane;
var controls;
//var motionRate, motionRate2;

var meshVertices = [];

// MODERNIZR // 
var supports_WebGL;
var minVertexHeight =   0.000001;

    var moonGlow;
    var mesh;
    var mouseX;
    var mouseY;
    var objects = [];
    var vertices;
    var faces; 
    var tempA;
    var tempB;
    var tempC;
    var countFaces = 0;
    var lengthFaces;
    var meshLoaded = false;
    var nbBands = 6;
    var nbBandsNumbers = [];
    var nbBandsLimits = [];
    var faceParent;
    var faceParentlength;
    var countKinectCloud  = 0 ;
    var composer, effectBloom;

    var verticalBandNumber = [];
    var verticalBandLimits = [];
    var nbVerticalBands = 80;
    var isFront = false;
    var lengthMesh = 60;
    var temp;
    var delay = Math.round(lengthMesh / nbBands)*2;
    var updateFlag = true;
    var panel = document.getElementById('panel');
    var canvasGL = null;
    var isPanelOpen = false;
    var hamburger;
    var canColorMesh = false;
    var interval;

    var loaded = false;
    var animNb = 0;
    var positionBuff = [];
    var colorsBuff = [];
    var frame  = [];
    var goDown = false;

    var width = 160;
    var length = 240;

    var effect;

    var scaleValue = {
        val : 150,
        glitch : 0,
        ratio : 0
    };
   
    var cameraPosZ = 5000;

    var canUpdate = true;
    var max = width * length -1;
    var pointSize = 0;
    var loaded = false;

    cameraX = 0;
    cameraY = 3;
    cameraZ = -69;

/*
var composer;
var chromaticAberrationPass;
WAGNER.vertexShadersPath = 'scripts/js/_lib/wagner/vertex-shaders';
WAGNER.fragmentShadersPath = 'scripts/js/_lib/wagner/fragment-shaders';
*/

//*******************************************************************//
//*******************************************************************//



function init()
{

	container = document.createElement( "div" );
	container.id = "webgl";

	modernizr_checkFeatures();
}





function modernizr_checkFeatures()
{
    Modernizr.on('webgl', function( result )
    {
        supports_WebGL = (result) ? true : false;
    });

    checkStatus_Features();
}





function checkStatus_Features ()
{
	if( supports_WebGL != undefined )
	{
	 	initWorld_ThreeJS();

	} else {
		
		setTimeout( function() {
			checkStatus_Features();
		}, 100 );

	}

}






function initWorld_ThreeJS()
{
	// Camera
	camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
	
	camera.position.x = 0.1;
	camera.position.y = 0;
	camera.position.z = -180;

	fovAlgorithm = 2 * Math.atan( ( (window.innerWidth) / camera.aspect ) / ( 2 * 1175 ) ) * ( 180 / Math.PI );

	camera.fov = fovAlgorithm;
	camera.updateProjectionMatrix();


	// Scene
	scene = new THREE.Scene();


	// Renderer
	 renderer = new THREE.WebGLRenderer( { width:  window.innerWidth, height:  window.innerHeight, scale:1, antialias: true });
	//renderer = new THREE.WebGLRenderer({ alpha: true });
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.getElementById("threejs-container").appendChild( renderer.domElement );


	// Controls
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.enableDamping = true;
	controls.dampingFactor = 0.25;
	controls.enableZoom = false;


    sphereMap_Geom  = new THREE.SphereGeometry( 600, 128, 128 );
    sphereMap_Mat  = new THREE.MeshBasicMaterial( { color: 0x333333, wireframe: true, opacity:0.1 } );
    sphereMap_Mat.side  = THREE.BackSide;
    sphereMap_Mat.transparent = true;

    sphereMap_Mesh  = new THREE.Mesh(sphereMap_Geom, sphereMap_Mat)
    sphereMap_Mesh.matrixAutoUpdate = false;
    sphereMap_Mesh.updateMatrix();
    scene.add(sphereMap_Mesh);


	// Lights
    directionalLight = new THREE.DirectionalLight( 0xFFFFFF, 0.9 );
    directionalLight.position.set( -10, 10, 1 );
    directionalLight.target.position.set( 10, 0, 0 );
    scene.add( directionalLight );  
    

	// Ambient Light
	//scene.add( new THREE.AmbientLight( 0xFFFFFF, 0.75 ) );
	
	// Point Light
	pointLight = new THREE.PointLight( 0x00ffd8, 1.5, 20 );
	scene.add( pointLight );

	pointLight2 = new THREE.PointLight( 0x00ffd8, 1.5, 20 );
	scene.add( pointLight2 );

	pointLight3 = new THREE.PointLight( 0x00ffd8, 1.5, 20 );
	scene.add( pointLight3 );

    pointLight5 = new THREE.PointLight( 0xd30041, 1.5, 30 );
    pointLight5.position.set(55, 7, 0);
    scene.add( pointLight5 );

    pointLight4 = new THREE.PointLight( 0xd30041, 1.5, 30 );
    pointLight4.position.set(15, 8, 0);
    scene.add( pointLight4 );
                                        /* 0x3d1371 */
    pointLight5 = new THREE.PointLight( 0xd30041, 1.5, 30 );
    pointLight5.position.set(-40, 8, 3);
    scene.add( pointLight5 );

	
	// Point Light representation
	pointLightRep = new THREE.SphereGeometry( 2, 16, 6);
	lightMesh = new THREE.Mesh( pointLightRep, new THREE.MeshBasicMaterial( { color: 0x71E3FF, wireframe:true } ) );
	//scene.add( lightMesh );

	//pointLightRep2 = new THREE.SphereGeometry( 2, 16, 6);
	lightMesh2 = new THREE.Mesh( pointLightRep, new THREE.MeshBasicMaterial( { color: 0x71E3FF, wireframe:true } ) );
	//scene.add( lightMesh2 );

	//pointLightRep3 = new THREE.SphereGeometry( 2, 16, 6);
	lightMesh3 = new THREE.Mesh( pointLightRep, new THREE.MeshBasicMaterial( { color: 0x71E3FF, wireframe:true } ) );
	//scene.add( lightMesh3 );


	loadJSONMesh();
	//createMesh();
    window.addEventListener( 'resize', onWindowResize, false );
	

	

}





function loadJSONMesh()
{
	jsonLoader = new THREE.JSONLoader();
	
	jsonLoader.load("./site-assets/plane.json", function ( geometry )
	{
		/*
		var Mat = new THREE.MeshPhongMaterial({color: 0x6eb5df,  shininess: 100,vertexColors: THREE.FaceColors})
		
		meshPlane = new THREE.Mesh( geometry, Mat );
		*/

		meshPlane = THREE.SceneUtils.createMultiMaterialObject( geometry, [
        	new THREE.MeshLambertMaterial({ color : 0x5700b0, vertexColors : THREE.FaceColors, wireframe : true, transparent : true, opacity : 1 }),
        	new THREE.MeshLambertMaterial({ color : 0x35006b, vertexColors : THREE.FaceColors/*, wireframe : true*/ })
		]);

		meshPlane.rotation.y = Math.PI / 2;
		
		meshPlane.scale.set( 10, 10, 10 );
		meshPlane.position.set( 0, 0, -150 );

		geometry.computeFaceNormals();
		geometry.computeVertexNormals();

		scene.add( meshPlane );



		vertices = meshPlane.children[0].geometry.vertices;
		vertices_lenth = geometry.vertices.length;

		geometry.colorNeedUpdate = true;
        
        faces = meshPlane.children[0].geometry.faces;
        lengthFaces = faces.length;


       

		var i = 0;
		var v = 0;
 
		while ( i < vertices.length )
		{
            //console.log( vertices[i].y );

             vertices[i].originalY =  vertices[i].y;

			if( vertices[i].y > minVertexHeight )
			{	
				meshVertices[v] = { vertex:vertices[i], originalY:vertices[i].y };
				++v;
			}

			vertices[i].setY(0);
			
			++i;

		}

        console.log( meshVertices.length );





		meshLoaded = true;

        var k = 0;
        while( k < nbBands ){

            var temp = Math.round(Math.random()*lengthMesh);

            nbBandsNumbers.push(  (Math.round(lengthFaces/lengthMesh * temp )) - (delay * k) -1) ;

            if(nbBandsNumbers[k] < 1){
                    nbBandsNumbers[k] = 0;
                    temp = 2;
            }
         
            nbBandsLimits.push(  Math.round(lengthFaces/lengthMesh * (temp-1)));

                
            k++;
        }




        meshLoaded = true;

        var k = 0;
        while( k < nbVerticalBands ){

           verticalBandNumber.push(  (Math.round(lengthFaces/lengthMesh * k ))  -1 ) ;
           if(verticalBandNumber[k] < 0){

                verticalBandNumber[k] = 0;

           }
           
           verticalBandLimits.push(  Math.round(lengthFaces/lengthMesh * (k-1)));
        
          
           k++;
        }
        


        /*
        TweenMax.to(camera, 1.5, {fov : 90,g :10, b : 10,  ease:Power4.easeInOut, onComplete: function()
        {
        	canColorMesh = true;
	    	//glitch();
     	
     		// checkVertices();
        	initHeight();

        }});
		*/
        initHeight();
		definePulse();
        threeJS_Animate();


        /*
        setTimeout( function()
        {
           vertices[1].setY(2);
           vertices[6].setY(2);
           vertices[3].setY(2);
        }, 4000)
        */
        

        document.addEventListener( 'mousemove', onDocumentMouseDown, false );

        setTimeout( function()
        {
            pulse();
        }, 5000);

	});
}










function createMesh()
{

  var custom_geom = new THREE.Geometry();
  custom_geom.vertices.push(
    new THREE.Vector3( -10,  10, 0 ),
    new THREE.Vector3( -10, -10, 0 ),
    new THREE.Vector3(  10, -10, 0 )
  );

    amount = 3; 
    var num = 1000;
    
    for(var i = 0; i < num; ++i)
    {
        var x = THREE.Math.randFloat( -10, 10 );
        var y = THREE.Math.randFloat( -10, 10 );
        var z = THREE.Math.randFloat( -10, 10 );
        custom_geom.vertices.push( new THREE.Vector3( x,  y, z ) );


     /*
    var mod = i % 3;
    console.log( mod );
    */

        var x = ( i % amount )/* * separation*/;
        var y = Math.floor( ( i / amount ) % amount )/* * separation*/;
        var z = Math.floor( i / ( amount * amount ) )/* * separation*/;
        custom_geom.faces.push( new THREE.Face3( x, y, z ) );

        console.log( x, y, z);
  }

  //custom_geom.faces.push( new THREE.Face3( 3, 4, 5 ) );

  custom_geom.computeBoundingSphere();
  meshPlane = THREE.SceneUtils.createMultiMaterialObject( custom_geom, [
          new THREE.MeshLambertMaterial({ color : 0xFF0099, vertexColors : THREE.FaceColors, wireframe : true, transparent : true, opacity : 1 }),
          new THREE.MeshLambertMaterial({ color : 0x71134b, vertexColors : THREE.FaceColors, wireframe : true })
    ]);

    //meshPlane.rotation.y = Math.PI / 2;
    
    meshPlane.scale.set( 2, 2, 2 );
    meshPlane.position.set( 0, 0, 0 );

    custom_geom.computeFaceNormals();
    custom_geom.computeVertexNormals();

    scene.add( meshPlane );

    threeJS_Animate();

}











var l = 0;
function checkVertices()
{	
	if( l < faces.length )
	{
		setTimeout( function()
		{	
			//try{
				//	console.log( meshVertices[l].vertex.y );
				faces[l].color.set("rgb(255, 0, 0)");
				vertices[l].setY(0.5);
				++l;

			//} catch(error){}
			
			checkVertices();

		},1 );

	}
}







function initHeight()
{
    i = 0;
    k = 0;
    vertLength = meshVertices.length;
    facesLength = Math.round( vertLength * 2.5 );


    var tl;

    var tweenArray = [];
    tl = new TimelineLite( { paused:true } );    

    while ( i < vertLength )
    {
        mesh = meshVertices[i];
        
        tl.add( new TweenMax.to(mesh.vertex, 0.75, {y : mesh.originalY, ease:Power4.easeOut}), 0.001 * i )
        
        ++i;

    }

    while ( k < facesLength )
    {
        tl.add(TweenMax.to(faces[k].color, 0.2, {r : 6,g :6, b : 6, ease:Power4.easeOut, onComplete: function(face)
        {
            TweenMax.to(face.color, 0.6, {r : 1,g :1, b : 1});
        }, onCompleteParams:[faces[k]]}), 0.00049 * k);

        ++k;
    }

    setTimeout( function()
    {
        tl.play();
    }, 400);


    TweenMax.to(camera.position, 1.5, { x : 0.02, y : 4, z : -120,  ease:Power4.easeInOut, delay:4, onComplete: function()
    {
        console.log( "CAMERA" )

    }});
  
}





    tll = new TimelineLite( { paused:true } );    

function definePulse()
{
    //i = 0;
    k = 0;
    glowAmount = 6;
    //vertLength = meshVertices.length;
    facesLength = Math.round( vertLength * 4.5 );

    
    var tweenArray = [];

    while ( k < facesLength )
    {

        if( glowAmount > 1 ) glowAmount -= 0.00067;
       
        tll.add(TweenMax.to(faces[k].color, 0.2, {r : glowAmount,g :glowAmount, b : glowAmount, ease:Power4.easeOut, onComplete: function(face)
        {
            TweenMax.to(face.color, 0.6, {r : 1,g :1, b : 1});
        }, onCompleteParams:[faces[k]]}), 0.0003 * k);

        ++k;
    }

}




function pulse()
{
    tll.play();
    
}










function onDocumentMouseDown( event ) {

        event.preventDefault();
        /*
        var vector = new THREE.Vector3(
            ( event.clientX / window.innerWidth ) * 2 - 1,
          - ( event.clientY / window.innerHeight ) * 2 + 1,
            0.5
        );
        
        //projector.unprojectVector( vector, camera );

        var ray = new THREE.Raycaster( camera.position, 
        vector.sub( camera.position ).normalize() );

        var intersects = ray.intersectObjects( meshPlane.children );
        */

        
        var mouse = new THREE.Vector2();
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;  
       
        var raycaster = new THREE.Raycaster( camera.position );
        raycaster.setFromCamera( mouse, camera );
        var intersects = raycaster.intersectObjects( meshPlane.children );


        if ( intersects.length > 0 ) {

            // console.log( "Has intersects" );

            meshPlane.children[0].geometry.colorsNeedUpdate = true
            meshPlane.children[1].geometry.colorsNeedUpdate = true
           

            i = 0;
            while( i < intersects.length )
            {
                //console.log( intersects[i] );

                /*
                var rColor = THREE.Math.randFloat( 1, 10 );
                var gColor = THREE.Math.randFloat( 1, 10 );
                var bColor = THREE.Math.randFloat( 1, 10 );
                */

                TweenMax.fromTo(faces[intersects[i].faceIndex].color, 0.5, {r : 10,g :10, b : 10},{r : 1,g :1, b : 1})  
                
                /*
                TweenMax.fromTo(faces[intersects[i].faceIndex+1].color, 0.5,{r : 6,g :6, b : 6},{r : 1,g :1, b : 1})
                TweenMax.fromTo(faces[intersects[i].faceIndex-1].color, 0.5, {r : 4,g :4, b : 4},{r : 1,g :1, b : 1})   
                TweenMax.fromTo(faces[intersects[i].faceIndex-2].color, 0.5, {r : 2,g :2, b : 2},{r : 1,g :1, b : 1})          
                TweenMax.fromTo(faces[intersects[i].faceIndex+2].color, 0.5, {r : 2,g :2, b : 2},{r : 1,g :1, b : 1}) 
                */

                if( intersects[i].distance > 30 )
                {
                    // intersects[i].point.z += intersects.distance/3;

                    temp = faces[intersects[i].faceIndex]                  

                    tempA = vertices[temp.a]
                    tempB = vertices[temp.b]
                    tempC = vertices[temp.c]
                    

                    TweenMax.to( tempA, 0.3, { y : tempA.y + THREE.Math.randFloat( 0.1, 0.25 ), ease: Expo.easeOut } )
                    TweenMax.to( tempB, 0.3, { y : tempB.y + THREE.Math.randFloat( 0.1, 0.25 ), ease: Expo.easeOut } )
                    TweenMax.to( tempC, 0.3, { y : tempC.y + THREE.Math.randFloat( 0.1, 0.25 ), ease: Expo.easeOut } )

                    TweenMax.to( tempA, 0.8, { y : tempA.originalY, delay: 0.3, ease: Elastic.easeOut } )
                    TweenMax.to( tempB, 0.8, { y : tempB.originalY, delay: 0.3, ease: Elastic.easeOut } )
                    TweenMax.to( tempC, 0.8, { y : tempC.originalY, delay: 0.3, ease: Elastic.easeOut } )

                   
                }
                
               
                i++;
             
            }      

        }

       
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;     
        

        //mouseX = ( event.clientX ) / window.innerWidth;
        //mouseY = ( event.clientY ) / window.innerHeight;

    }













/*
function initHeight()
{
              i = 0;
              all = Math.round(meshVertices.length);
              console.log( all + " vertices" );

              middle = Math.round(meshVertices.length/4);
              middleReal = Math.round(meshVertices.length/2);
              middlePlus = Math.round(meshVertices.length/2);
              middleLess = Math.round(meshVertices.length/2);

              invertValuePlus = Math.round(faces.lengthMesh/2);

              invertValueLess = Math.round(faces.length/2);

              j = faces.length;
              m = 0;
              k = faces.length;
              l = meshVertices.length;

              console.log( k );

              length = 0;
              while(i < l)
              {
			    if(middlePlus < all)
			    {
                      temp =  meshVertices[middlePlus];
                   
                      if(temp.originalY > minVertexHeight){
                      		 TweenMax.to(temp.vertex, 0.8, {y : temp.originalY, delay : 0.0025 * i, ease:Back.easeInOut})
                      		 //console.log( temp.vertex )
                          }

                          middlePlus++;

                  }
           

                  if(middleLess > 0)
                  {
                      temp =  meshVertices[middleLess];

                      if(temp.originalY > minVertexHeight){

                              TweenMax.to(temp.vertex, 0.8, {y : temp.originalY, delay : 0.0025*i, ease:Back.easeInOut})
                           
                          }

                          middleLess--;  

                  }
                 
                                   

                  if(i == (middleReal-1))
                  {
                      TweenMax.to(temp.vertex, 0.8, {y : temp.originalY, delay : 0.0025*i, ease:Back.easeInOut, onComplete:function(){

                          setTimeout(front,600);
                            

                       // interval = setInterval(verticalColorMesh,7500);
                         
                         
                      }});
                  }

                  if(i > middle){
                      if( invertValueLess > 0 && invertValueLess < j){

                          TweenMax.to(faces[invertValueLess].color, 0.2, {r : 6,g :6, b : 6, delay : 0.0012*i, onComplete: function(face){

                              TweenMax.to(face.color, 0.6, {r : 1,g :1, b : 1});
                          }, onCompleteParams:[faces[invertValueLess]]});

                      }

                      invertValueLess--;


                      if( invertValueLess > 0 && invertValueLess < j){

                          TweenMax.to(faces[invertValueLess].color, 0.2, {r : 6,g :6, b : 6, delay : 0.0012*i, onComplete: function(face){

                              TweenMax.to(face.color, 0.6, {r : 1,g :1, b : 1});
                          }, onCompleteParams:[faces[invertValueLess]]});

                      }

                      invertValueLess--;


                      if( invertValuePlus > 0 && invertValuePlus < j){

                          TweenMax.to(faces[invertValuePlus].color, 0.2, {r : 6,g :6, b : 6, delay : 0.0012*i, onComplete: function(face){

                              TweenMax.to(face.color, 0.6, {r : 1,g :1, b : 1});
                          }, onCompleteParams:[faces[invertValuePlus]]});

                      }

                      invertValuePlus++;


                      if( invertValuePlus > 0 && invertValuePlus < j){

                          TweenMax.to(faces[invertValuePlus].color, 0.2, {r : 6,g :6, b : 6, delay : 0.0012*i, onComplete: function(face){

                              TweenMax.to(face.color, 0.6, {r : 1,g :1, b : 1});
                          }, onCompleteParams:[faces[invertValuePlus]]});

                      }

                      invertValuePlus++;

                     

                  }

                  
                  
                  i++;
              }

                  
          }

*/





/*
 function animateColorMesh()
 {
		//console.log( "animateColorMesh");

	    i = 0;
        all = Math.round(meshVertices.length);

        middle = Math.round(meshVertices.length/5);
        middleReal = Math.round(meshVertices.length/2);
        middlePlus = Math.round(meshVertices.length/2);
        middleLess = Math.round(meshVertices.length/2);

        invertValuePlus = Math.round(faces.length/2);
        invertValueLess = Math.round(faces.length/2);

        j = faces.length;
        m = 0;
        k = faces.length;
        l = meshVertices.length;


        length = 0;
        while(i < l){
         
                if( invertValueLess > 0 && invertValueLess < j){
                	TweenMax.to(faces[invertValueLess].color, 0.2, {r : 6,g :6, b : 6, delay : 0.0005*i, onComplete: function(face){
                        TweenMax.to(face.color, 0.6, {r : 1,g :1, b : 1});
                    }, onCompleteParams:[faces[invertValueLess]]});

                }

                invertValueLess--;


                if( invertValueLess > 0 && invertValueLess < j){

                    TweenMax.to(faces[invertValueLess].color, 0.2, {r : 6,g :6, b : 6, delay : 0.0005*i, onComplete: function(face){

                        TweenMax.to(face.color, 0.6, {r : 1,g :1, b : 1});
                    }, onCompleteParams:[faces[invertValueLess]]});

                }

                invertValueLess--;


                if( invertValuePlus > 0 && invertValuePlus < j){

                    TweenMax.to(faces[invertValuePlus].color, 0.2, {r : 6,g :6, b : 6, delay : 0.0005*i, onComplete: function(face){

                        TweenMax.to(face.color, 0.6, {r : 1,g :1, b : 1});
                    }, onCompleteParams:[faces[invertValuePlus]]});

                }

                invertValuePlus++;


                if( invertValuePlus > 0 && invertValuePlus < j){

                    TweenMax.to(faces[invertValuePlus].color, 0.2, {r : 6,g :6, b : 6, delay : 0.0005*i, onComplete: function(face){

                        TweenMax.to(face.color, 0.6, {r : 1,g :1, b : 1});
                    }, onCompleteParams:[faces[invertValuePlus]]});

                }

                invertValuePlus++;
            
            i++;
        }


    }

*/













/*
function back(){
        isFront = false;
        updateFlag = false;

        TweenMax.to(camera.position, 1.2, {x : 0 ,y :0, z : -150, ease:Power4.easeOut, onComplete:function(){
            updateFlag = true;

            animateColorMesh();

            clearInterval(interval);

            interval = setInterval(animateColorMesh,7500);


        }});

    }

    function front(){


        scaleAnimFront();
        animateColorMesh();

        updateFlag = false;


  
           TweenMax.to(camera.position, 0.8, {x : camera.x, z : camera.z,y :camera.y, ease:Power4.easeOut, onComplete:function(){
               updateFlag = true;
               isFront = true;

               

               //TweenMax.to(pcBuffer.material, 2, {size : 1});
               
               

               setTimeout(verticalColorMesh,200);

                clearInterval(interval);

                interval = setInterval(verticalColorMesh,7500);

           }});





    }









function verticalColorMesh(){


        //verticalMoveLand();

        r = 0;
        limit = 120;
        nbVerticalBands = 60;

            while(r < nbVerticalBands){

                i = limit-1;
                k = 0;
                delay = Math.random()/2;
                while(i > 0){

                    temp = faces[r * limit + i]

                    TweenMax.to(temp.color, 0.2, {r : 6,g :6, b : 6,delay : 0.01 * k + delay, onComplete: function(face){
                        TweenMax.to(face.color, 0.2, {r : 1,g :1, b : 1});
                    }, onCompleteParams:[temp]});

                    i--;
                    k++;
                 
                }
                r++;


            }


          

       
       

      

       

    }










 function scaleAnimFront(){
        canUpdate = true;

        TweenMax.to(scaleValue, 2, {val : 4 , ease: Power4.easeInOut})


        

        

    }



    function glitch(){
        i=0;
        count = 20;
        delayTime = 0.01;
        amplitude = 30;
        halfAmplitude = amplitude/2;
        // camera.position.z = -100
        // camera.position.x = 0;

        while(i<count){

            del = i*delayTime;
            TweenMax.fromTo(scaleValue,delayTime, {ratio : Math.random()*amplitude - halfAmplitude},  {ratio : Math.random()*amplitude - halfAmplitude, delay : del})

            i++;

        }


        TweenMax.to(scaleValue, 0, {ratio : 0 , delay: count*delayTime+0.1, onComplete: function(){
            // parentText.visible = false
        }})
    }


    function scaleAnimBack(){

    TweenMax.to(scaleValue, 0.8, {val : 30 , ease: Power4.easeInOut, onComplete: function(){
        back();
        canUpdate = false;
        TweenMax.to(panel, 0.6, {x : -250, delay:0.6,ease:Power4.easeOut });
        TweenMax.to(hamburger, 0.6, {x : 0, delay:0.6,ease:Power4.easeOut });
    }});


    }

*/








//var projector = new THREE.Projector();

    function cameraUpdate(){

        camera.updateProjectionMatrix();

    }
/*
    function onDocumentMouseDown( event ) {

        event.preventDefault();

        var vector = new THREE.Vector3(
            ( event.clientX / window.innerWidth ) * 2 - 1,
          - ( event.clientY / window.innerHeight ) * 2 + 1,
            0.5
        );
        projector.unprojectVector( vector, camera );

        var ray = new THREE.Raycaster( camera.position, 
        vector.sub( camera.position ).normalize() );

        var intersects = ray.intersectObjects( objects[0].children );

        if ( intersects.length > 0 ) {

            mesh.children[0].geometry.colorsNeedUpdate = true
            mesh.children[1].geometry.colorsNeedUpdate = true
           

            i=0
            while(i<intersects.length){

                TweenMax.fromTo(faces[intersects[i].faceIndex].color, 0.5, {r : 10,g :10, b : 10},{r : 1,g :1, b : 1})  

                TweenMax.fromTo(faces[intersects[i].faceIndex+1].color, 0.5,{r : 8,g :8, b : 8},{r : 1,g :1, b : 1})              

                TweenMax.fromTo(faces[intersects[i].faceIndex-1].color, 0.5, {r : 8,g :8, b : 8},{r : 1,g :1, b : 1})   

                TweenMax.fromTo(faces[intersects[i].faceIndex-2].color, 0.5, {r : 5,g :5, b : 5},{r : 1,g :1, b : 1})          

                TweenMax.fromTo(faces[intersects[i].faceIndex+2].color, 0.5, {r : 5,g :5, b : 5},{r : 1,g :1, b : 1}) 



                if(intersects[i].distance > 32){
                    // intersects[i].point.z += intersects.distance/3;



                    temp = faces[intersects[i].faceIndex]
                    

                    tempA = vertices[temp.a]
                    
                    tempB = vertices[temp.b]
                    
                    tempC = vertices[temp.c]
                    

                    TweenMax.to(tempA, 0.2, {y : tempA.y+2})
                    TweenMax.to(tempB, 0.2, {y : tempB.y+2})
                    TweenMax.to(tempC, 0.2, {y : tempC.y+2})

                    TweenMax.to(tempA, 0.2, {y : tempA.originalY, delay: 0.2})
                    TweenMax.to(tempB, 0.2, {y : tempB.originalY, delay: 0.2})
                    TweenMax.to(tempC, 0.2, {y : tempC.originalY, delay: 0.2})

                   
                }
                
               
                i++;
             
            }      

        }

        mouseX = ( event.clientX ) / window.innerWidth

        mouseY = ( event.clientY ) / window.innerHeight

    }
*/













function threeJS_Animate(time) {

	requestAnimationFrame( threeJS_Animate );
	threeJS_Render(time);
	
}





function threeJS_Render()
{
	//requestAnimationFrame( threeJS_Render );

	//controls.update();

	motionRate = Date.now() * 0.0002;
	pointLight.position.x = ( 20 * Math.cos( motionRate * 2 ) ) + 40;
	pointLight.position.y = ( 5 * Math.cos( motionRate * 1.65 ) ) + 10;
	pointLight.position.z = ( 7 * Math.sin( motionRate ) ) - 00;

	motionRate2 = Date.now() * 0.0002;
	pointLight2.position.x = ( 20 * Math.cos( motionRate2 * 2 ) ) - 30;
	pointLight2.position.y = ( 5 * Math.cos( motionRate2 * 1.65 ) ) + 10;
	pointLight2.position.z = ( 7 * Math.sin( motionRate2 ) ) - 10;

	motionRate3 = Date.now() * 0.0002;
	pointLight3.position.x = ( 20 * Math.cos( motionRate3 * 3 ) ) - 0;
	pointLight3.position.y = ( 5 * Math.cos( motionRate3 * 1.65 ) ) + 10;
	pointLight3.position.z = ( 7 * Math.sin( motionRate3 ) ) - 10;

/*
	motionRate4 = Date.now() * 0.0002;
	pointLight4.position.x = ( 2 * Math.cos( motionRate2 * 2 ) ) - 30;
	pointLight4.position.y = ( 2 * Math.cos( motionRate2 * 1.65 ) ) + 10;
	pointLight4.position.z = ( 1 * Math.sin( motionRate2 ) ) - 0;

	motionRate5 = Date.now() * 0.0002;
	pointLight5.position.x = ( 2 * Math.cos( motionRate3 * 3 ) ) + 15;
	pointLight5.position.y = ( 2 * Math.cos( motionRate3 * 1.65 ) ) + 12;
	pointLight5.position.z = ( 1 * Math.sin( motionRate3 ) ) - 0;
*/
/*
	lightMesh.position.copy( directionalLight.position );
	lightMesh2.position.copy( pointLight5.position );
	lightMesh3.position.copy( pointLight3.position );
*/
	
	meshPlane.children[0].geometry.verticesNeedUpdate = true;
	meshPlane.children[1].geometry.elementsNeedUpdate = true;
	meshPlane.children[0].geometry.colorsNeedUpdate = true
    meshPlane.children[1].geometry.colorsNeedUpdate = true
    meshPlane.children[0].geometry.computeFaceNormals();
	
	camera.lookAt( scene.position );
	
	renderer.render( scene, camera );

}





function onWindowResize()
{
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );

}