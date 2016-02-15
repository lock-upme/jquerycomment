<?php 
	mysql_connect("localhost", "root", "") or
	die("Could not connect: " . mysql_error());
	mysql_select_db("test");
	mysql_query("SET NAMES UTF8"); 
	
	$tmp = array('DayUP', 'Lock', '李白');
	$ind = array_rand($tmp);
	$username = $tmp[$ind];
	
	$tmp = array('1', '2', '3');
	$ind = array_rand($tmp);
	$uid = $tmp[$ind];
	
	$table = $_POST['type'];
	if (empty($table)) { return false; }

	$op = $_POST['op'];
	
	//评论列表
	if ($op == 'list') {
		$page = $_POST['page'] ? intval($_POST['page']) : 1;
		$size = $_POST['size'] ? intval($_POST['size']) : 10;		
		$start = ($page-1) * $size;
		$id = $_POST['id'];
				
		$result = mysql_query("SELECT comid, uid,username, content FROM ut_{$table}_comment WHERE aid=$id ORDER BY created DESC LIMIT $start, $size;");		
		$data = array();
		while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
			$data[] = $row;
		}
		mysql_free_result($result);
		
		echo json_encode($data);
		exit();
	
	//回复列表
	} elseif ($op == 'replylist') {
		$id = $_POST['id'];
		
		$result = mysql_query("SELECT id, uid, username, content FROM ut_{$table}_comment_reply WHERE comid=$id ORDER BY created DESC;");
		
		$data = array();
		while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
			$data[] = $row;
		}
		mysql_free_result($result);
		
		echo json_encode($data);
		exit();
		
	//添加评论
	} elseif ($op == 'addcomment') {
		$content = trim($_POST['content']);
		if (empty($content)) { return false; }
		$id = $_POST['id'];
		$time = time();
		
		$sql = "INSERT INTO ut_{$table}_comment(uid, username, aid,content,created) VALUES($uid, '$username',$id, '$content', $time);";
		$result = mysql_query($sql);
		$comid = mysql_insert_id();
		
		$data = array('comid' => $comid, 'uid' => $uid, 'username' => $username, 'content' => $content);
		echo json_encode($data);
		exit();
		
	//添加回复
	} elseif ($op == 'addreply') {
		$content = trim($_POST['content']);
		if (empty($content)) { return false; }
		$id = $_POST['id'];
		$comid = $_POST['comid'];
		$time = time();
		
		$sql = "INSERT INTO ut_{$table}_comment_reply(comid, uid,username,aid,content,created) VALUES($comid, $uid, '$username', $id, '$content', $time);";
		$result = mysql_query($sql);
		$replyid = mysql_insert_id();
		
		$data = array('id' => $replyid, 'uid' => $uid, 'username' => $username, 'content' => $content);
		echo json_encode($data);
		exit();		
	}
