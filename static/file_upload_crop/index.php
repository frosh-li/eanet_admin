<?php
error_reporting (E_ALL ^ E_NOTICE);
session_start(); //Do not remove this
//only assign a new timestamp if the session variable is empty
if (!isset($_SESSION['random_key']) || strlen($_SESSION['random_key'])==0){
    $_SESSION['random_key'] = strtotime(date('Y-m-d H:i:s')); //assign the timestamp to the session variable
	$_SESSION['user_file_ext']= "";
}

#########################################################################################################
# CONSTANTS																								#
# You can alter the options below																		#
#########################################################################################################
$upload_dir = "upload_pic"; 				// The directory for the images to be saved in
$upload_path = $upload_dir."/";				// The path to where the image will be saved
$large_image_prefix = "resize_"; 			// The prefix name to large image
$thumb_image_prefix = "thumbnail_";			// The prefix name to the thumb image
$large_image_name = $large_image_prefix.$_SESSION['random_key'];     // New name of the large image (append the timestamp to the filename)
$thumb_image_name = $thumb_image_prefix.$_SESSION['random_key'];     // New name of the thumbnail image (append the timestamp to the filename)
$max_file = "3"; 							// Maximum file size in MB
$max_width = "1900";							// Max width allowed for the large image
$thumb_width = "100";						// Width of thumbnail image
$thumb_height = "100";						// Height of thumbnail image
// Only one of these image types should be allowed for upload
$allowed_image_types = array('image/pjpeg'=>"jpg",'image/jpeg'=>"jpg",'image/jpg'=>"jpg",'image/png'=>"png",'image/x-png'=>"png",'image/gif'=>"gif");
//$allowed_image_types = array('image/pjpeg'=>"jpg",'image/jpeg'=>"jpg",'image/jpg'=>"jpg");
$allowed_image_ext = array_unique($allowed_image_types); // do not change this
$image_ext = "";	// initialise variable, do not change this.
foreach ($allowed_image_ext as $mime_type => $ext) {
    $image_ext.= strtoupper($ext)." ";
}


##########################################################################################################
# IMAGE FUNCTIONS																						 #
# You do not need to alter these functions																 #
##########################################################################################################
function resizeImage($image,$width,$height,$scale) {
	list($imagewidth, $imageheight, $imageType) = getimagesize($image);
	$imageType = image_type_to_mime_type($imageType);
	$newImageWidth = ceil($width * $scale);
	$newImageHeight = ceil($height * $scale);
	$newImage = imagecreatetruecolor($newImageWidth,$newImageHeight);
	switch($imageType) {
		case "image/gif":
			$source=imagecreatefromgif($image); 
			break;
	    case "image/pjpeg":
		case "image/jpeg":
		case "image/jpg":
			$source=imagecreatefromjpeg($image); 
			break;
	    case "image/png":
		case "image/x-png":
			$source=imagecreatefrompng($image); 
			break;
  	}
	imagecopyresampled($newImage,$source,0,0,0,0,$newImageWidth,$newImageHeight,$width,$height);
	
	switch($imageType) {
		case "image/gif":
	  		imagegif($newImage,$image); 
			break;
      	case "image/pjpeg":
		case "image/jpeg":
		case "image/jpg":
	  		imagejpeg($newImage,$image,90); 
			break;
		case "image/png":
		case "image/x-png":
			imagepng($newImage,$image);  
			break;
    }
	
	chmod($image, 0777);
	return $image;
}

//You do not need to alter these functions
function resizeThumbnailImage($thumb_image_name, $image, $width, $height, $start_width, $start_height, $scale, $newImageWidth, $newImageHeight){
	list($imagewidth, $imageheight, $imageType) = getimagesize($image);
	$imageType = image_type_to_mime_type($imageType);
	
	$newImage = imagecreatetruecolor($newImageWidth,$newImageHeight);
	
	switch($imageType) {
		case "image/gif":
			$source=imagecreatefromgif($image); 
			break;
	    case "image/pjpeg":
		case "image/jpeg":
		case "image/jpg":
			$source=imagecreatefromjpeg($image); 
			break;
	    case "image/png":
		case "image/x-png":
			$source=imagecreatefrompng($image); 
			break;
  	}

  	imagecopyresampled($newImage , $source , 0 , 0 , $start_width , $start_height , $newImageWidth , $newImageHeight , $width , $height);

	switch($imageType) {
		case "image/gif":
	  		imagegif($newImage,$thumb_image_name); 
			break;
      	case "image/pjpeg":
		case "image/jpeg":
		case "image/jpg":
	  		imagejpeg($newImage,$thumb_image_name,90); 
			break;
		case "image/png":
		case "image/x-png":
			imagepng($newImage,$thumb_image_name);  
			break;
    }

	chmod($thumb_image_name, 0777);
	return $thumb_image_name;
}

//You do not need to alter these functions
function getHeight($image) {
	$size = getimagesize($image);
	$height = $size[1];
	return $height;
}

//You do not need to alter these functions
function getWidth($image) {
	$size = getimagesize($image);
	$width = $size[0];
	return $width;
}

//Image Locations
$large_image_location = $upload_path.$large_image_name.$_SESSION['user_file_ext'];
$thumb_image_location = $upload_path.$thumb_image_name.$_SESSION['user_file_ext'];

//Create the upload directory with the right permissions if it doesn't exist
if(!is_dir($upload_dir)){
	mkdir($upload_dir, 0777);
	chmod($upload_dir, 0777);
}

//Check to see if any images with the same name already exist
if (file_exists($large_image_location)){
	if(file_exists($thumb_image_location)){
		$thumb_photo_exists = "<img src=\"".$upload_path.$thumb_image_name.$_SESSION['user_file_ext']."\" alt=\"Thumbnail Image\"/>";
	}else{
		$thumb_photo_exists = "";
	}
   	$large_photo_exists = "<img src=\"".$upload_path.$large_image_name.$_SESSION['user_file_ext']."\" alt=\"Large Image\"/>";
} else {
   	$large_photo_exists = "";
	$thumb_photo_exists = "";
}



if (isset($_POST["upload"])) { 
	//Get the file information
	$userfile_name = $_FILES['image']['name'];
	$userfile_tmp = $_FILES['image']['tmp_name'];
	$userfile_size = $_FILES['image']['size'];
	$userfile_type = $_FILES['image']['type'];
	$filename = basename($_FILES['image']['name']);
	$file_ext = strtolower(substr($filename, strrpos($filename, '.') + 1));

	//Only process if the file is a JPG, PNG or GIF and below the allowed limit
	if((!empty($_FILES["image"])) && ($_FILES['image']['error'] == 0)) {
		
		foreach ($allowed_image_types as $mime_type => $ext) {
			if($file_ext==$ext && $userfile_type==$mime_type){
				$error = "";
				break;
			}else{
				$error = "只能接受扩展名为<strong>".$image_ext."</strong>的文件！<br />";
			}
		}
		if ($userfile_size > ($max_file*1048576)) $error.= "文件大小不能大于".$max_file."MB";
		
	}else{
		$error= "请选择一张图片";
	}

	//Everything is ok, so we can upload the image.
	if (strlen($error)==0){
		if (isset($_FILES['image']['name'])){
			//this file could now has an unknown file extension (we hope it's one of the ones set above!)
//			$large_image_location = $large_image_location.".".$file_ext;
//			$thumb_image_location = $thumb_image_location.".".$file_ext;
//			
//			$file_ext = "jpg";
			
			//put the file ext in the session so we know what file to look for once its uploaded
			$_SESSION['user_file_ext']=".".$file_ext;
			
			$large_image_location = $upload_path.$large_image_name.$_SESSION['user_file_ext'];
			$thumb_image_location = $upload_path.$thumb_image_name.$_SESSION['user_file_ext'];

			move_uploaded_file($userfile_tmp, $large_image_location);
			chmod($large_image_location, 0777);
			
			$width = getWidth($large_image_location);
			$height = getHeight($large_image_location);

			if($width < $_POST["width"] || $height < $_POST["height"]){
				if (file_exists($large_image_location)) {
					unlink($large_image_location);
				}
?>
		<script>
			alert("上传的图片尺寸为<?php echo $width ?> * <?php echo $height ?>; 不能小于<?php echo $_POST['width'] ?> * <?php echo $_POST['height'] ?>");
			window.location.href = "index.php?type=get&width=<?php echo $_POST['width'] ?>&height=<?php echo $_POST['height']?>&div_id=<?php echo $_POST['div_id'] ?>&resizable=<?php echo $_POST['resizable'] ?>&div_id=<?php echo $_POST['div_id'] ?>";
		</script>
<?php }
			if ($width > $max_width){
				$scale = $max_width/$width;
				$uploaded = resizeImage($large_image_location,$width,$height,$scale);
			}else{
				$scale = 1;
				$uploaded = resizeImage($large_image_location,$width,$height,$scale);
			}

			if (file_exists($thumb_image_location)) {
				unlink($thumb_image_location);
			}

			//Check to see if any images with the same name already exist
			if (file_exists($large_image_location)){
				if(file_exists($thumb_image_location)){
					$thumb_photo_exists = "<img src=\"".$upload_path.$thumb_image_name.$_SESSION['user_file_ext']."\" alt=\"Thumbnail Image\"/>";
				}else{
					$thumb_photo_exists = "";
				}
			   	$large_photo_exists = "<img src=\"".$upload_path.$large_image_name.$_SESSION['user_file_ext']."\" alt=\"Large Image\"/>";
			} else {
			   	$large_photo_exists = "";
				$thumb_photo_exists = "";
			}

		}

	}
}


if (isset($_POST["upload_thumbnail"]) && strlen($large_photo_exists)>0) {
	//Get the new coordinates to crop the image.
	$x1 = $_POST["x1"];
	$y1 = $_POST["y1"];
	$x2 = $_POST["x2"];
	$y2 = $_POST["y2"];
	$w = $_POST["w"];
	$h = $_POST["h"];
	$new_width = $_POST["width"];
	$new_height = $_POST["height"];
	//Scale the image to the thumb_width set above
	$scale = $thumb_width/$w;
	$cropped = resizeThumbnailImage($thumb_image_location, $large_image_location,$w,$h,$x1,$y1,$scale,$new_width,$new_height);

	if(file_exists($cropped)){
		$_SESSION['random_key']= "";
		$_SESSION['user_file_ext']= "";
?>
	<script type="text/javascript" src="js/jquery-pack.js"></script>
	<script>
		var imgname 	=	'<?php echo $thumb_image_name; ?>',
			index 		=	'1',
			code  		=	0,
			msg			=	'裁剪不成功！',
			imgurl 		=	'<?php echo $thumb_image_location; ?>',
			input_name 	=	'<?php echo $_POST["inputName"]; ?>',
			node 		=	'<?php echo $_POST["node"]; ?>',
			picCount 	= 	'<?php echo $_POST["picCount"]; ?>';

		alert("裁剪保存成功！");
		window.parent.defaultcallback( index , code , msg , imgname , imgurl , input_name , node , picCount );
		$("#<?php echo $_POST['div_id'] ?>",window.parent.document).remove();
	</script>
<?php
	exit;
	}

}


if ($_GET['a']=="delete" && strlen($_GET['t'])>0){
	$large_image_location = $upload_path.$large_image_prefix.$_GET['t'];
	$thumb_image_location = $upload_path.$thumb_image_prefix.$_GET['t'];
	if (file_exists($large_image_location)) {
		unlink($large_image_location);
		echo '1';
	}else{ 
		echo '0';
	}
/*	if (file_exists($thumb_image_location)) {
		unlink($thumb_image_location);
	}
	echo '1';
*/	
	exit(); 
}

?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="generator" content="WebMotionUK" />
	<title>带截图功能的图片上传</title>

	<script type="text/javascript" src="js/jquery-pack.js"></script>
	<script type="text/javascript" src="js/jquery.imgareaselect.js"></script>
	<style>
		body { 
			font-size: 12px
		}
	</style>
</head>
<body>

<?php
//Only display the javacript if an image has been uploaded
if(strlen($large_photo_exists)>0){
	$current_large_image_width = getWidth($large_image_location);
	$current_large_image_height = getHeight($large_image_location);
?>

<script type="text/javascript">
function preview(img, selection) {
	var scaleX = <?php echo $thumb_width;?> / selection.width; 
	var scaleY = <?php echo $thumb_height;?> / selection.height; 
	
	$('#ThumbnailPreview').css({ 
		width: Math.round(scaleX * <?php echo $current_large_image_width;?>) + 'px', 
		height: Math.round(scaleY * <?php echo $current_large_image_height;?>) + 'px',
		marginLeft: '-' + Math.round(scaleX * selection.x1) + 'px', 
		marginTop: '-' + Math.round(scaleY * selection.y1) + 'px' 
	});
	$('#x1').val(selection.x1);
	$('#y1').val(selection.y1);
	$('#x2').val(selection.x2);
	$('#y2').val(selection.y2);
	$('#w').val(selection.width);
	$('#h').val(selection.height);

	$("#selection_scale").html(selection.width + "*" + selection.height);
	$("#selection_pointers").html(selection.x1 + " " + selection.x2 + " " + selection.y1 + " " + selection.y2);
} 

$(document).ready(function () { 
	$('#save_thumb').click(function() {
		var x1 = $('#x1').val();
		var y1 = $('#y1').val();
		var x2 = $('#x2').val();
		var y2 = $('#y2').val();
		var w = $('#w').val();
		var h = $('#h').val();
		if(x1=="" || y1=="" || x2=="" || y2=="" || w=="" || h==""){
			alert("请先选择剪裁区域！");
			return false;
		}else{
			return true;
		}
	});
});

$(window).load(function () { 
	$('#thumbnail').imgAreaSelect({ aspectRatio: 'null', onSelectChange: preview, width: "<?php echo $_POST['width'] ?>", height: "<?php echo $_POST['height'] ?>", resizable: "<?php echo $_POST['resizable'] ?>" }); 
});

</script>

<?php }

if(strlen($error)>0){
	echo "<ul><li><strong>Error!</strong></li><li>".$error."</li></ul>";
}

if(strlen($large_photo_exists)>0 && strlen($thumb_photo_exists)>0){

	echo $large_photo_exists."&nbsp;".$thumb_photo_exists;
	echo "<p><a href=\"".$_SERVER["PHP_SELF"]."?a=delete&t=".$_SESSION['random_key'].$_SESSION['user_file_ext']."\">Delete images</a></p>";
	echo "<p><a href=\"".$_SERVER["PHP_SELF"]."\">Upload another</a></p>";
	//Clear the time stamp session and user file extension
	$_SESSION['random_key']= "";
	$_SESSION['user_file_ext']= "";

}else{

	if(strlen($large_photo_exists)>0 && $_POST["upload_sign"] == 2){?>
		<div style="position:relative;text-align:center" class="center" id="crop_image">

			<div style="position:relative">
				<div style="float: left; margin-right: 10px; min-width: <?php echo $_POST['width'] ?>px; min-height:<?php echo $_POST['height'] ?>px">
					<img src="<?php echo $upload_path.$large_image_name.$_SESSION['user_file_ext'];?>" id="thumbnail" alt="Create Thumbnail" />
				</div>
				<div style="float:left;">
					<div style="border:1px #e5e5e5 solid; position:relative; overflow:hidden; width:<?php echo $thumb_width;?>px; height:<?php echo $thumb_height;?>px;">
						<img src="<?php echo $upload_path.$large_image_name.$_SESSION['user_file_ext'];?>" style="position: relative;" alt="Thumbnail Preview" id="ThumbnailPreview" />
					</div>
					<div>
						<br>
						剪裁显示尺寸
						<br>
						<?php echo $_POST['width'] ?>px * <?php echo $_POST['height'] ?>px
					</div>
				</div>
			</div>

			<br style="clear:both;"/>

			<div style="margin-top:10px">图片尺寸<span id="img_scale">0*0</span> 选中尺寸<span id="selection_scale">0*0</span> 选中坐标：<span id="selection_pointers">0 0 0 0</span></div>

			<form name="thumbnail" action="<?php echo $_SERVER["PHP_SELF"];?>" method="post" style="margin:0 auto;margin-top:13px;position:relative">
				<input type="hidden" name="x1" value="" id="x1" />
				<input type="hidden" name="y1" value="" id="y1" />
				<input type="hidden" name="x2" value="" id="x2" />
				<input type="hidden" name="y2" value="" id="y2" />
				<input type="hidden" name="w" value="" id="w" />
				<input type="hidden" name="h" value="" id="h" />
				<input type="hidden" name="width" value="<?php echo $_POST['width'] ?>" id="width" />
				<input type="hidden" name="height" value="<?php echo $_POST['height'] ?>" id="height" />
				<input type="hidden" name="div_id" value="<?php echo $_POST['div_id'] ?>" id="div_id" />
				<input type="hidden" name="resizable" value="<?php echo $_POST['resizable'] ?>" id="resizable" />
				<input type="hidden" name="p" value="<?php echo $_POST['p'] ?>" id="p" />
				<input type="hidden" name="inputName" value="<?php echo $_POST['inputName'] ?>" id="inputName" />
				<input type="hidden" name="node" value="<?php echo $_POST['node'] ?>" id="node" />
				<input type="hidden" name="fileSize" value="<?php echo $_POST['fileSize'] ?>" id="fileSize" />
				<input type="hidden" name="setType" value="<?php echo $_POST['setType'] ?>" id="setType" />
				<input type="hidden" name="picCount" value="<?php echo $_POST['picCount'] ?>" id="picCount" />
				<input type="submit" name="upload_thumbnail" value="保存" id="save_thumb" />
				<input type="button" id="delete_picture" value="删除">
			</form>

		</div>

		<script>
			$(function(){
				$("#thumbnail").load(function(){
					var img_width = $(this).width()+145;
					var img_height = $(this).height()+100;

					img_width = $(this).width() > <?php echo $_POST['width'] ?> ? img_width : <?php echo $_POST['width'] ?>+145;
					img_height = $(this).width() > <?php echo $_POST['height'] ?> ? img_height : <?php echo $_POST['height'] ?>+100;

					$("#<?php echo $_POST['div_id'] ?> iframe",window.parent.document).css({"width":img_width,"height":img_height});

					var body_width = window.parent.document.body.scrollWidth ? window.parent.document.body.scrollWidth : window.parent.document.documentElement.scrollWidth; 
					var body_height = window.parent.document.body.scrollHeight ? window.parent.document.body.scrollHeight : window.parent.document.documentElement.scrollHeight;

					var width = (body_width - parseInt($("#<?php echo $_POST['div_id'] ?>",window.parent.document).width()) )/2;
					var height = (body_height - parseInt($("#<?php echo $_POST['div_id'] ?>",window.parent.document).height()))/2;

					$("#<?php echo $_POST['div_id'] ?>",window.parent.document).css({left:width,top:"20px"});
					$("#img_scale").html($(this).width() + "*" + $(this).height());	
				});

				$("#delete_picture").click(function(){ 
					$.ajax({ 
						url: "<?php echo $_SERVER["PHP_SELF"]."?a=delete&t=".$_SESSION['random_key'].$_SESSION['user_file_ext']; ?>",
						success: function(res){
							if(res == 1){ 
								alert("删除成功！");
								window.location.href = document.referrer;
							}
						}
					});
				});

			});
		</script>

	<?php }else if($_GET["type"] == "get"){ ?>

	<div style="position:relative;width:<?php echo $_GET['width']+170 ?>px;height:<?php echo $_GET['height']+50 ?>px;text-align:center">
		<div id="picture_div" style="width:100%;height:100%">
			<div style="float: left; margin-right:10px;background:#ccc;min-width: <?php echo $_GET['width'] ?>px; min-height:<?php echo $_GET['height'] ?>px;padding:10px">
				<div style="width: <?php echo $_GET['width'] ?>px; height:<?php echo $_GET['height'] ?>px;border:1px dashed #999;background:white;text-align:center;vertical-align:middle;display:table;">
					<div style="text-align:center;display:table-cell;vertical-align:middle;">
						裁剪区域：<?php echo $_GET['width'] ?>*<?php echo $_GET['height'] ?></span>
						<br>
						上传图片尺寸不能小于剪裁区域尺寸！
						<br>
						<form name="photo" enctype="multipart/form-data" action="<?php echo $_SERVER["PHP_SELF"];?>" method="post" id="photo_form" style="margin: 0px auto; width: 89px; text-align: center; position: relative;margin-top: 10px;">
							<label class="file1" style="position:relative;background-color: rgb(207, 89, 69);border-radius: 4px;border-color: rgb(209, 91, 71);color: rgb(255, 255, 255);font-size: 12px;font-weight: normal;line-height: 17px;padding: 12px;padding-top: 5px;padding-bottom: 5px;text-align: center;text-shadow: rgba(0, 0, 0, 0.247059) 0px -1px 0px;vertical-align: middle;cursor:pointer;width: 48px;">选择图片</label>
							<input type="file" name="image" id="image" onchange="uploadImg();" style="position:absolute;left:0px;display:inline;width:68px;z-index:10;cursor:pointer;opacity: 0;filter:alpha(opacity=0)" />
							<input type="hidden" name="width" value="<?php echo $_GET['width'] ?>" id="width" />
							<input type="hidden" name="height" value="<?php echo $_GET['height'] ?>" id="height" />
							<input type="hidden" name="div_id" value="<?php echo $_GET['div_id'] ?>" id="div_id" />
							<input type="hidden" name="resizable" value="<?php echo $_GET['resizable'] ?>" id="resizable" />
							<input type="hidden" name="p" value="<?php echo $_GET['p'] ?>" id="p" />
							<input type="hidden" name="inputName" value="<?php echo $_GET['inputName'] ?>" id="inputName" />
							<input type="hidden" name="node" value="<?php echo $_GET['node'] ?>" id="node" />
							<input type="hidden" name="fileSize" value="<?php echo $_GET['fileSize'] ?>" id="fileSize" />
							<input type="hidden" name="setType" value="<?php echo $_GET['setType'] ?>" id="setType" />
							<input type="hidden" name="picCount" value="<?php echo $_GET['picCount'] ?>" id="picCount" />
							<input type="hidden" name="upload_sign" value="2">
							<input type="submit" id="upload_file" name="upload" value="上传" style="display: none; position: absolute;"/>
						</form>
					</div>
				</div>	
			</div>
			<div style="border:1px #e5e5e5 solid; float:left; position:relative; overflow:hidden; width:<?php echo $thumb_width;?>px; height:<?php echo $thumb_height;?>px;background:#ccc;line-height:100px">
				<div>图片预览</div>
			</div>	
		</div>
	</div>
		<script type="text/javascript">
			function uploadImg(){
				$("#upload_file").trigger("click");
			}

			$(".file1").click(function(){
				//$("#image").trigger("click");
			});

		</script>

	<?php } ?>

<?php } ?>

</body>
</html>
