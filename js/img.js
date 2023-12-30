const categoryDist = {
	"旅游": "dubai",
	"日常": "maldives",
	"重大事件": "sapa",
	"搞怪": "paris"
}
const preApi = "https://api.github.com/repos/yz-love-yxp/yz-love-yxp.github.io/contents/json/img";

function getImgs(page) {
	$.getJSON("json/img"+page+".json", function(apiData) {
		pageData = apiData;
		for (let i = 0; i < 16; i++) {
			// 初始化：置空/删除原块信息对应的model
			let index = i + 1;
			$("#img" + index).attr("src", "");
			$(".home-title" + index).text("此位置暂无图片");
			$("#home-subtitle" + index).text("点击添加");
			$("#home-subtitle" + index).parent().parent().parent().parent().parent().removeClass("dubai maldives sapa paris");
			$("#home-subtitle" + index).parent().parent().attr("href", "#portfolioModalNew");
			if ($("#portfolioModal" + index).length > 0) {
				$("#portfolioModal" + index).remove();
			}
			// 若在有效范围内及为空
			if (pageData["imgs"][i]) {
				let [img, title, subtitle, address, description] = ["de-img", "title", "subtitle", "address", "description"].map((key)=>{
					return CryptoJS.AES.decrypt(pageData["imgs"][i][key], sk, {"mode": CryptoJS.mode.ECB}).toString(CryptoJS.enc.Utf8);
				})
				// 设置主页块信息
				$("#img" + index).attr("src", img); // 设置图片
				$(".home-title" + index).text(title); // 设置标题
				$("#home-subtitle" + index).text(pageData["imgs"][i]["time"] + " " + address); // 设置副标题
				$("#home-subtitle" + index).parent().parent().parent().parent().parent().addClass(categoryDist[pageData["imgs"][i]["category"]]); // 设置分类
				// 对存在model的设置跳转
				$("#home-subtitle" + index).parent().parent().attr("href", "#portfolioModal" + index);
				$("#portfolioModalNew").before($(
					`
					<div class="portfolio-modal modal fade" id="portfolioModal` 
					+ index +
					`" tabindex="-1" role="dialog" aria-hidden="true">
					  <div class="modal-content">
						<div class="close-modal" data-dismiss="modal">
						  <div class="lr">
							<div class="rl"> </div>
						  </div>
						</div>
						<div class="container">
						  <div class="row">
							<div class="col-lg-8 col-lg-offset-2">
							  <div class="modal-body"> 
								<!-- Project Details Go Here -->
								<h2>`
								+ title +
								`</h2>
								<p class="item-intro">`
								+ subtitle +
								`</p><img class="img-responsive img-centered" src="`
								+ img +
								`" alt="">  
								<p style="font-size: 16px">`
								+ description +
								`</p>
								<ul class="list-inline">
								  <li style="font-size: 16px"><strong>日期</strong>: `
								  + pageData["imgs"][i]["time"] +
								  `</li>
								  <li style="font-size: 16px"><strong>地点</strong>: `
								  + address +
								  `</li>
								  <li style="font-size: 16px"><strong>分类</strong>: `
								  + pageData["imgs"][i]["category"] +
								  `</li>
								</ul>
								<a href="#portfolioModalNew"><button type="button" class="btn btn-primary"  data-dismiss="modal">修改信息</button></a>
								<button type="button" class="btn btn-primary" data-dismiss="modal"><i class="fa fa-times"></i> 关闭页面</button>
							  </div>
							</div>
						  </div>
						</div>
					  </div>
					</div>
					`
				));
			} 
		}
	});
}

function setNowClick(index) {
	nowClick = index;
	if (pageData["imgs"][index-1]) {
		$("#newTime").val(pageData["imgs"][index-1]["time"])
		$("#newAddress").val(pageData["imgs"][index-1]["address"])
		$("#newCategory").val(pageData["imgs"][index-1]["category"])
		$("#newTitle").val(pageData["imgs"][index-1]["title"])
		$("newSubtitle").val(pageData["imgs"][index-1]["subtitle"])
		$("newDescription").val(pageData["imgs"][index-1]["description"])
	}
}

function encrypt(pt) {
	return CryptoJS.AES.encrypt(pt, sk, {"mode": CryptoJS.mode.ECB}).toString();
}

function newImg() {
	pageData["imgs"][nowClick-1] = {
		"time": $("#newTime").val(),
		// "address": encrypt($("#newAddress").val()),
		"address": encrypt($("#newAddress").val()),
		"title": encrypt($("#newTitle").val()),
		"subtitle": encrypt($("#newSubTitle").val()),
		"description": encrypt($("#newDescription").val()),
		"category": encrypt($("#newCategory").val()),
		"de-img": encrypt(nowImg)
	}
	$.get(preApi + pagination.pages.pageNo + ".json", function(apiData, status){
		sha = apiData["sha"]
		$.ajax({
			"url": preApi + pagination.pages.pageNo + ".json",
			"method": "PUT",
			"dataType": "json",
			"data": JSON.stringify({
				"message": "测试更新文件接口",
				"content": CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(pageData))),
				"sha": sha
			}),
			success: function (result) {
				window.alert("提交成功！")
				console.log(result)
				$("#portfolioModalNew").hide()
			},
			error: (err) => {
				window.alert("提交失败！")
				console.log(err)
			},
			"headers": {
				'Authorization': 'Bearer ' + token,
				"content-type": "application/json"
			},
		})
	});
}