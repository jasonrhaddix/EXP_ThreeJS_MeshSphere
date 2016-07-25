var container;
var camera, scene, renderer;
var supports_WebGL;
var SHADOW_MAP_WIDTH = 2048
var SHADOW_MAP_HEIGHT = 1024;
var light;
var lightShadowMapViewer;
var meshVertices = [];
var meshPlane;
var vertices;
var jsonLoader;





function init()
{
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
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = -100;
    fovAlgorithm = 2 * Math.atan( ( (window.innerWidth) / camera.aspect ) / ( 2 * 1175 ) ) * ( 180 / Math.PI );
    camera.fov = fovAlgorithm;
    camera.updateProjectionMatrix();


    // Scene
    scene = new THREE.Scene();


    // Renderer
    renderer = new THREE.WebGLRenderer( { width:window.innerWidth, height:window.innerHeight, scale:1, antialias:true, alpha:true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.autoClear = false;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;


    // Lights
    // ---- AmbientLight
    scene.add( new THREE.AmbientLight( 0xFFFFFF, 0.05 ) );

    // ---- DirectionalLight 1
    directionalLight1 = new THREE.DirectionalLight( 0xFFFFFF, 0.5   );
    directionalLight1.position.set( 0, 0, 60 );
    directionalLight1.target.position.set( 0, 0, 100 );
    scene.add( directionalLight1 );

    // ---- DirectionalLight 2
    directionalLight2 = new THREE.DirectionalLight( 0xFF0099, 1.3 );
    directionalLight2.position.set( 0, -20, -5 );
    directionalLight2.target.position.set( 0, 0, 0 );
    directionalLight2.castShadow = true;
    directionalLight2.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 10, 1, 1200, 2500 ) );
    directionalLight2.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    directionalLight2.shadow.mapSize.height = SHADOW_MAP_HEIGHT;
    scene.add( directionalLight2 ); 

    // ---- PointLight 1
    pointLight1 = new THREE.PointLight( 0xFFFFFF, 2, 30 );
    pointLight1.position.set(0, -25, 10);
    pointLight1.castShadow = true;
    pointLight1.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 10, 1, 1200, 2500 ) );
    pointLight1.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    pointLight1.shadow.mapSize.height = SHADOW_MAP_HEIGHT;
    scene.add( pointLight1 ); 

    // ---- PointLight 2
    pointLight2 = new THREE.PointLight( 0xFFFFFF, 2, 80 );
    pointLight2.position.set(0, 25, -10);
    pointLight2.castShadow = true;
    pointLight2.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 10, 1, 1200, 2500 ) );
    pointLight2.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    pointLight2.shadow.mapSize.height = SHADOW_MAP_HEIGHT;
    scene.add( pointLight2 ); 

    // ---- PointLight 3
    pointLight3 = new THREE.PointLight( 0xFFFFFF, 2, 80 );
    pointLight3.position.set(0, 25, 10);
    pointLight3.castShadow = true;
    pointLight3.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 10, 1, 1200, 2500 ) );
    pointLight3.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    pointLight3.shadow.mapSize.height = SHADOW_MAP_HEIGHT;
    scene.add( pointLight3 ); 

    
    // ---- Light Representation
    lightRep = new THREE.SphereGeometry( 2, 16, 6);    
    lightMesh = new THREE.Mesh( lightRep, new THREE.MeshBasicMaterial( { color: 0x71E3FF, wireframe:true } ) );
    lightMesh.position.copy( directionalLight1.position );
    // scene.add( lightMesh );


    /*
    // Controls  
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = false;
    */


    jsonLoader = new THREE.JSONLoader();


    loadInnerGeom();
    
}






function loadInnerGeom()
{
    
    
    jsonLoader.load("./site-assets/sphere2.json", function ( geometry )
    {
        geometry.computeFaceNormals();

        var Mat = new THREE.MeshLambertMaterial({color: 0x2f393a, shading:THREE.FlatShading, vertexColors: THREE.FaceColors})
        
        meshPlane = new THREE.Mesh( geometry, Mat );
        meshPlane.scale.set( 15, 15, 15 );
        scene.add( meshPlane );

        vertices = geometry.vertices;
        vertices_lenth = geometry.vertices.length;

        geometry.colorNeedUpdate = true;
        geometry.verticesNeedUpdate = true;
        
        faces = meshPlane.geometry.faces;

        meshPlane.castShadow = true;
        meshPlane.receiveShadow = true;


        var i = 0;
        
        while ( i < vertices.length )
        {
            //meshVertices[i] = { vertex:vertices[i], originalY:vertices[i].y };
           
            vertices[i].originalY =  vertices[i].y;
            vertices[i].multiplyScalar(THREE.Math.randFloat( 0.7, 1.1 ));
            
            ++i;

        }


        var Mat2 = new THREE.MeshLambertMaterial({color: 0x5b6463, vertexColors: THREE.FaceColors, wireframe:true})
        meshPlane2 = new THREE.Mesh( geometry, Mat2 );
        meshPlane2.scale.set( 16, 16, 16 );
        scene.add( meshPlane2 ); 


        geometry.computeFaceNormals();     

    });
    

    loadMiddleGeom();    

}




function loadMiddleGeom()
{
    jsonLoader.load("./site-assets/sphere2.json", function ( geometry )
    {
                                                    /* 0x14cdbc */
        var Mat3 = new THREE.MeshLambertMaterial({color:0x0E9185, vertexColors:THREE.VertexColors, wireframe:true})
        meshPlane3 = new THREE.Mesh( geometry, Mat3 );
        //meshPlane3.scale.set( 22, 22, 22 );

        geometry.computeFaceNormals();
        scene.add( meshPlane3 );

        geometry.colorNeedUpdate = true;
        geometry.verticesNeedUpdate = true;


        meshGeom = geometry;



        textureLoader = new THREE.TextureLoader();
        textureLoader.load( 'site-assets/images/textures/point.png', function ( texture )
        {
            sprite = event.content;
        
            pointGeometry = new THREE.Geometry();
            
            for ( i = 0; i < meshGeom.vertices.length; i ++ )
            {
                pointGeometry.vertices.push( meshGeom.vertices[i] );
                
                var xPos = meshGeom.vertices[i].x;
                var yPos = meshGeom.vertices[i].y;
                var zPos = meshGeom.vertices[i].z;

                pointGeometry.vertices[i].setX( xPos );
                pointGeometry.vertices[i].setY( yPos );
                pointGeometry.vertices[i].setZ( zPos );

            } 

            material = new THREE.PointsMaterial( { size:2, sizeAttenuation:false, map:texture, transparent:true } );
            
            pointGeometry.scale( 1, 1, 1 )
            
            particles = new THREE.Points( pointGeometry, material );
            particles.geometry.scale( 24, 24, 24 );
            particles.sortParticles = true;
            scene.add( particles );

            } );

    });


    loadOutterGeom();

}




function loadOutterGeom()
{
    jsonLoader.load("./site-assets/sphere2.json", function ( geometry )
    {
        /*
        meshPlane = THREE.SceneUtils.createMultiMaterialObject( geometry, [
            new THREE.MeshLambertMaterial({ color : 0x6700b0, vertexColors : THREE.FaceColors, wireframe : true, opacity : 1 }),
            new THREE.MeshLambertMaterial({ color : 0x35006b, vertexColors : THREE.FaceColors })
        ]);
        */

        var Mat4 = new THREE.MeshLambertMaterial({color:0x456a6c, vertexColors:THREE.FaceColors, wireframe:true})
        meshPlane4 = new THREE.Mesh( geometry, Mat4 );
        //meshPlane4.scale.set( 110, 110, 110 );

        geometry.computeFaceNormals();
        scene.add( meshPlane4 );

        geometry.colorNeedUpdate = true;
        geometry.verticesNeedUpdate = true;



        textureLoader2 = new THREE.TextureLoader();
        textureLoader2.load( 'site-assets/images/textures/point.png', function ( texture )
        {
            sprite = event.content;
        
            pointGeometry2 = new THREE.Geometry();
            
            for ( i = 0; i < geometry.vertices.length; i ++ )
            {
                pointGeometry2.vertices.push( geometry.vertices[i] );
                
                var xPos = geometry.vertices[i].x;
                var yPos = geometry.vertices[i].y;
                var zPos = geometry.vertices[i].z;

                pointGeometry2.vertices[i].setX( xPos );
                pointGeometry2.vertices[i].setY( yPos );
                pointGeometry2.vertices[i].setZ( zPos );

            } 

            material2= new THREE.PointsMaterial( { size:2, sizeAttenuation:false, map:texture, transparent:true } );
            
            pointGeometry2.scale( 120, 120, 120 )
            
            particles2 = new THREE.Points( pointGeometry2, material2 );
            //particles2.geometry.scale( 110, 110, 110 );
            particles2.sortParticles = true;
            scene.add( particles2 );


            setTimeout( function()
            {
                threeJS_Animate();
            
            }, 10 );
        

            document.addEventListener( 'mousemove', onDocumentMouseDown, false );

            document.getElementById("threejs-container").appendChild( renderer.domElement );
        
            window.addEventListener( 'resize', onWindowResize, false );  
        
        } );

    });
}






function threeJS_Animate(time) {

    requestAnimationFrame( threeJS_Animate );
    threeJS_Render(time);
    
}





function threeJS_Render()
{
    motionRate = Date.now() * 0.000075;
    var x = motionRate * 2;
    var y = motionRate * 1.65;
    var z = motionRate;

    meshPlane.rotation.set( x, y, z ); 
    meshPlane2.rotation.set( x, y, z ); 
    meshPlane3.rotation.set( y, z, x );
    particles.rotation.set( y, z, x ); 
    
    var y = motionRate * 0.6;
    meshPlane4.rotation.set( 0, y, 0 );
    particles2.rotation.set( 0, y, 0 ); 

    
    meshPlane.geometry.verticesNeedUpdate = true;
    meshPlane.geometry.elementsNeedUpdate = true;
    meshPlane.geometry.colorsNeedUpdate = true
    meshPlane.geometry.computeFaceNormals();

    meshPlane.verticesNeedUpdate = true;
    meshPlane.colorsNeedUpdate = true;
    meshPlane.geometry.computeVertexNormals();

    meshPlane2.verticesNeedUpdate = true;
    meshPlane2.colorsNeedUpdate = true;
    meshPlane2.geometry.computeVertexNormals();

    meshPlane3.verticesNeedUpdate = true;
    meshPlane3.colorsNeedUpdate = true;
    meshPlane3.geometry.computeVertexNormals();

    meshPlane4.verticesNeedUpdate = true;
    meshPlane4.colorsNeedUpdate = true;
    meshPlane4.geometry.computeVertexNormals();
    

    camera.lookAt( scene.position );

    renderer.clear();    
    renderer.render( scene, camera );

}





function onWindowResize()
{
    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;


    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

}









function onDocumentMouseDown( event )
{
        event.preventDefault();

        var mouse = new THREE.Vector2();
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;  
       
        var raycaster = new THREE.Raycaster( camera.position );
        raycaster.setFromCamera( mouse, camera );
        
        var intersects = raycaster.intersectObject( meshPlane );


        if ( intersects.length > 0 ) {

            meshPlane.geometry.colorsNeedUpdate = true;
            
            i = 0;
            while( i < intersects.length )
            {
                TweenMax.fromTo(faces[intersects[i].faceIndex].color, 0.75, {r : 10,g :10, b : 10},{r : 1,g :1, b : 1})  
                   
                try {    
                    TweenMax.fromTo(faces[intersects[i].faceIndex+1].color, 0.75, {r : 4,g :4, b : 4},{r : 1,g :1, b : 1})   
                } catch(error){}

                try {    
                    TweenMax.fromTo(faces[intersects[i].faceIndex+2].color, 0.75, {r : 2,g :2, b : 2},{r : 1,g :1, b : 1})          
                } catch(error){}

                try {    
                    TweenMax.fromTo(faces[intersects[i].faceIndex-1].color, 0.75, {r : 4,g :4, b : 4},{r : 1,g :1, b : 1})   
                } catch(error){}

                try {    
                    TweenMax.fromTo(faces[intersects[i].faceIndex-2].color, 0.75, {r : 2,g :2, b : 2},{r : 1,g :1, b : 1})          
                } catch(error){}


                if( intersects[i].distance > 30 )
                {
                    temp = faces[intersects[i].faceIndex];                 

                    tempA = vertices[temp.a];
                    tempB = vertices[temp.b];
                    tempC = vertices[temp.c];
                    

                    TweenMax.to( tempA, 0.3, { y : tempA.y + THREE.Math.randFloat( 0.01, 0.05 ), ease: Expo.easeOut } )
                    TweenMax.to( tempB, 0.3, { y : tempB.y + THREE.Math.randFloat( 0.01, 0.05 ), ease: Expo.easeOut } )
                    TweenMax.to( tempC, 0.3, { y : tempC.y + THREE.Math.randFloat( 0.01, 0.05 ), ease: Expo.easeOut } )

                    TweenMax.to( tempA, 0.65, { y : tempA.originalY, delay: 0.5, ease: Elastic.easeOut } )
                    TweenMax.to( tempB, 0.65, { y : tempB.originalY, delay: 0.5, ease: Elastic.easeOut } )
                    TweenMax.to( tempC, 0.65, { y : tempC.originalY, delay: 0.5, ease: Elastic.easeOut } )
    
                }
               
                i++;
             
            }      

        }
       
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;     
        
    }
