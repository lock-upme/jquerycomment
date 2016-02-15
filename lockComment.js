/**
 * 评论插件
 *
 * @author lock
 */
(function($) {
	$.fn.lockComment = function(options) {	
		var defaults = {
				url : 'comment.php',//评论
				action : 'list',//评论操作
				type : 'article',//读取哪张表文章的评论
				id : 1,//文章ID
				page : 1,
				size : 10			
		};
		var opts = $.extend(defaults, options);
		var obj= $(this);
		var avatar = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PCEtLQpTb3VyY2UgVVJMOiBob2xkZXIuanMvNjR4NjQKQ3JlYXRlZCB3aXRoIEhvbGRlci5qcyAyLjYuMC4KTGVhcm4gbW9yZSBhdCBodHRwOi8vaG9sZGVyanMuY29tCihjKSAyMDEyLTIwMTUgSXZhbiBNYWxvcGluc2t5IC0gaHR0cDovL2ltc2t5LmNvCi0tPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PCFbQ0RBVEFbI2hvbGRlcl8xNTI4YmZlYzQ3NyB0ZXh0IHsgZmlsbDojQUFBQUFBO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1mYW1pbHk6QXJpYWwsIEhlbHZldGljYSwgT3BlbiBTYW5zLCBzYW5zLXNlcmlmLCBtb25vc3BhY2U7Zm9udC1zaXplOjEwcHQgfSBdXT48L3N0eWxlPjwvZGVmcz48ZyBpZD0iaG9sZGVyXzE1MjhiZmVjNDc3Ij48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiNFRUVFRUUiLz48Zz48dGV4dCB4PSIxNC41IiB5PSIzNi41Ij42NHg2NDwvdGV4dD48L2c+PC9nPjwvc3ZnPg=='; 
		
		//评论列表
		var list = function() {
			$.post( opts.url, { op : opts.action, type : opts.type,  page : opts.page, size : opts.size, id : opts.id }, function(data){
				var html = '<div class="commentlist">';
			
				$.each(data, function(i,item){					  
					  
					  html += '<div class="media">';
					  html += '<div class="media-left">';
					  html += '<a href="'+item.uid+'"><img class="media-object" src="'+avatar+'" alt="..." width="50"></a>';
					  html += ' </div>';
					  html += '<div class="media-body">';
					  html += '<h5 class="media-heading">'+item.username+'</h5>';
					  html +=  item.content;
					  html += '<a href="javascript:;" class="jsReplyComment" data-comid="'+item.comid+'">回复' + '</a>';
					  html += '</div>';
					  html += '</div>';
					  
				  });
				html += '</div>'
				  obj.append(html);
			}, 'json');
						
			form();			
		};
		
		//赞
		var laud = function() {
			
		};
		
		//评论表单
		var form = function() {
			var html = '<div class="commentForm">';
			html += '<div>评论</div>';
			html += '<form id="commentForm">';
			html += '<div><textarea></textarea></div>';
			html += '<div><button type="button" id="test">提交</button></div>';
			html += '</form>';
			html += '</div>';			
			obj.append(html);
			
			listen();
		}
		
		//回复列表
		var replyList = function(e, comid) {
			$.post( opts.url, { op : 'replylist', type : opts.type,  id : comid }, function(data){
				var html = '<div class="replylist">';
			
				$.each(data, function(i,item){ 
					  
					  html += '<div class="media">';
					  html += '<div class="media-left">';
					  html += '<a href="'+item.uid+'"><img class="media-object" src="'+avatar+'" alt="..." width="50"></a>';
					  html += ' </div>';
					  html += '<div class="media-body">';
					  html += '<h5 class="media-heading">'+item.username+'</h5>';
					  html +=  item.content;
					  html += '<a href="javascript:;" class="jsReplyCommentUsername" data-username="'+item.username+'" data-replyid="'+item.id+'">回复' + '</a>';
					  html += '</div>';
					  html += '</div>';
					  
				  });
				html += '</div>'
				$(e.target).after(html);
			}, 'json');
		};
		
		//评论回复的回复
		var replyCommentUsername = function() {
			obj.delegate('.jsReplyCommentUsername', 'click', function(e){				
				var username = $(this).attr('data-username');
				$(this).parents('.replylist').next('input').val('@'+username+' ');				
			});			
		};
		
		//回复表单
		var replyForm = function() {			
			obj.delegate('.jsReplyComment', 'click',function(e){
				if ($(this).next('.replylist').length) { $(this).next('.replylist').toggle().next('input').toggle().nextAll('a').toggle();return false; }
				
				if ($(this).next('input').length) { return false; }
				var html = '';
				html += '<input class="form-control input-sm" placeholder="回复一下……" type="text">';
				html += '<a href="javascript:;" class="jsReplySubmit" data-comid="'+$(this).attr('data-comid')+'">回复</a> <a href="javascript:;" class="jsCancelReply">取消</a>';
				$(e.target).after(html);
				
				replyList(e, $(this).attr('data-comid'));
			});
		};
		
		
		//回复提交
		var replySubmit = function() {
			obj.delegate('.jsReplySubmit', 'click', function(e){
				//alert($(e.target).prevAll('.replylist').html());
				var input = $(this).prev('input');
				if ($.trim(input.val()) == '') { input.focus(); return false; }
				$.post( opts.url, { op : 'addreply', type : opts.type,  comid : $(this).attr('data-comid'), id : opts.id, content : input.val() }, function(item){
					var html = '';
					html += '<div class="media">';
					html += '<div class="media-left">';
					html += '<a href="'+item.uid+'"><img class="media-object" src="'+avatar+'" alt="..." width="50"></a>';
					html += ' </div>';
					html += '<div class="media-body">';
					html += '<h5 class="media-heading">'+item.username+'</h5>';
					html +=  item.content;
					html += '<a href="javascript:;" class="jsReplyCommentUsername" data-username="'+item.username+'" data-replyid="'+item.id+'">回复' + '</a>';
					html += '</div>';
					html += '</div>';
					input.val('');
					$(e.target).prevAll('.replylist').prepend(html);
					
				}, 'json');
			});			
		};
		
		//回复取消
		var replyCancel = function(e) {
			obj.delegate('.jsCancelReply', 'click', function(e){
				$(e.target).toggle().prev().toggle().prev('input').val('').toggle().prevAll('.replylist').toggle();
			});
		};
		
		//评论提交
		var commentSubmit = function() {
			obj.delegate('button[type="button"]', 'click', function(){
				var content = obj.find('textarea');
				if ($.trim(content.val()) == '') {
					content.focus();
					return false;
				}
				var html = '';
				$.post( opts.url, { op : 'addcomment', type : opts.type,  id : opts.id, content : content.val() }, function(item){

					  html += '<div class="media">';
					  html += '<div class="media-left media-middle">';
					  html += '<a href="'+item.uid+'"><img class="media-object" src="'+avatar+'" alt="..." width="50"></a>';
					  html += ' </div>';
					  html += '<div class="media-body">';
					  html += '<h5 class="media-heading">'+item.username+'</h5>';
					  html +=  item.content;
					  html += '<a href="javascript:;" class="jsReplyComment" data-id="'+item.comid+'">回复' + '</a>';
					  html += '</div>';
					  html += '</div>';
					  content.val('');
					  obj.find('.commentlist').prepend(html);
					
				}, 'json');
			});			
		};
		
		//监听事件
		var listen = function() {
			replyForm();
			replySubmit();
			replyCommentUsername();
			replyCancel();
			
			commentSubmit();
		};
		
		//初始化
		var init = function() {
			list();
		};
		
		init();
		
	};
})(jQuery);