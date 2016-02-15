# jquery comment


#功能介绍
评论插件；

每篇文章下面都有评论，评论的格式都一样；

可能对应的评论表不一样，但这不妨碍我们写个通用的评论插件

因为要有一定的格式，在此引用bootstrap的样式，实际项目中可自行修改

评论要用到用户名和用户ID，本例子中没有建立用户表，直接在程序中随便用户名和ID


参数说明：

			url : 评论处理后端程序
			
			action : 评论操作
			
			type : 读取哪张表文章的评论
			
			id : 文章ID
			
			page : 页数,
			
			size : 每页显示多少条
			
			
			
#引用方法

在body中直接引用

	$('#comment').lockComment();
	
#表

		CREATE TABLE IF NOT EXISTS `ut_article_comment` (
		  `comid` int(10) NOT NULL AUTO_INCREMENT,
		  `aid` int(10) NOT NULL,
		  `uid` int(10) NOT NULL,
		  `username` varchar(20) NOT NULL,
		  `content` text NOT NULL,
		  `created` int(10) NOT NULL,
		  PRIMARY KEY (`comid`),
		  KEY `aid` (`aid`,`uid`,`created`)
		) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;
		
		--
		-- 转存表中的数据 `ut_article_comment`
		--
		
		INSERT INTO `ut_article_comment` (`comid`, `aid`, `uid`, `username`, `content`, `created`) VALUES
		(1, 1, 1, 'daydayup', 'hello world', 0),
		(2, 1, 2, '美丽', '小小的生活', 0),
		(3, 1, 1, 'Lock', '让我们有着不一样的生活', 1454077048),
		(4, 1, 2, '李白', '要么改变自己，要么改变未来！', 1454077117),
		(5, 1, 2, '李白', '老婆大人的未来～', 1454077383);
		
		--
		-- 表的结构 `ut_article_comment_reply`
		--
		
		CREATE TABLE IF NOT EXISTS `ut_article_comment_reply` (
		  `id` int(10) NOT NULL AUTO_INCREMENT,
		  `comid` int(10) NOT NULL,
		  `aid` int(10) NOT NULL,
		  `content` text NOT NULL,
		  `created` int(10) NOT NULL,
		  `uid` int(10) NOT NULL,
		  `username` varchar(20) NOT NULL,
		  PRIMARY KEY (`id`),
		  KEY `comid` (`comid`,`aid`,`uid`)
		) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=15 ;
		
		--
		-- 转存表中的数据 `ut_article_comment_reply`
		
		INSERT INTO `ut_article_comment_reply` (`id`, `comid`, `aid`, `content`, `created`, `uid`, `username`) VALUES
		(1, 1, 1, 'China', 1454074476, 437, 'Lock'),
		(2, 1, 1, 'My Son', 1454074910, 437, '李白'),
		(3, 1, 1, '@天天向上 你好，我是天天向下', 1454074983, 437, 'Lock'),
		(4, 1, 1, 'Life My', 1454075113, 437, 'DayUP'),
		(5, 1, 1, 'wife is my', 1454075165, 437, '李白'),
		(6, 1, 1, '人人都是产品经理', 1454075296, 437, 'DayUP'),
		(7, 1, 1, 'this is my mac', 1454075384, 437, '李白'),
		(8, 1, 1, 'SOS', 1454075520, 437, 'Lock'),
		(9, 1, 1, 'just so so', 1454075681, 437, '李白'),
		(10, 1, 1, '@李白 yeah', 1454075695, 437, 'Lock'),
		(11, 2, 1, '这是什么东东', 1454075764, 437, '李白'),
		(12, 4, 1, 'Yes', 1454077213, 3, 'DayUP'),
		(13, 4, 1, '就是这样的！', 1454077260, 3, 'DayUP'),
		(14, 4, 1, '好吧，我知道了！', 1454077305, 2, '李白');
		
#处理程序comment.php

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

		