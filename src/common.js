//파일명 설정
var setting = '.min';
//var setting = '';

//공통 데이터 로드 함수
function loadData(src)
{
	//XMLHttpRequest를 사용해 데이터 파일 로드
	//로드가 완료되면 다음 작업을 진행하도록 Promise 적용
	return new Promise((resolve, reject) =>
	{
		var request = new XMLHttpRequest();
		request.open('GET', src);
		request.responseType = 'json';
		request.onreadystatechange = function ()
		{
			if (request.readyState === XMLHttpRequest.DONE && request.status === 200)
			{
				resolve(request.response);
			}
		};
		request.send();
	});
}

//구형 데이터 로드 함수
export function loadDataOld(src)
{
	//<script> 요소를 추가해 데이터 파일 로드
	//로드가 완료되면 다음 작업을 진행하도록 Promise 적용
	return new Promise((resolve, reject) =>
	{
		var script = document.createElement('script');
		script.type = "text/javascript";
		script.src = src;
		script.addEventListener('load', () => { resolve(); }, false);
		script.addEventListener('error', () => { reject(); }, false);
		var s = document.getElementsByTagName("script")[0];
		s.parentNode.insertBefore(script, s);
	});
}

//지역 데이터 로드 함수
export function loadAreaData(areaNum)
{
	return new Promise((resolve, reject) =>
	{
		//src를 지역 데이터 파일 주소로 설정해 데이터 파일을 로드하고 areaData 오브젝트 리턴
		var src = "data/data-area" + areaNum + setting + ".json";
		loadData(src).then((areaData) => resolve(areaData), () => reject());
	});
}

//스테이지 데이터 로드 함수
export function loadStageData(stageTitle)
{
	return new Promise(resolve =>
	{
		//src를 지역 데이터 파일로 설정해 로드
		var src = "./data/data-area" + getAreaByStageTitle(stageTitle) + setting + ".json";
		loadData(src).then((areaData) =>
		{
			var stageData = areaData.stage.find(sData => sData.title === stageTitle);
			var type = getTypeByStageTitle(stageTitle)
			var stageList = areaData.stage.reduce((acc, sData) =>
			{
				if (getTypeByStageTitle(sData.title) === type) acc.push(getIndexByStageTitle(sData.title))
				return acc;
			}, []);
			resolve({ "stageData": stageData, "stageList": stageList });
		});

	});
}

export function loadEnemyDataList()
{
	return new Promise(resolve =>
	{
		var src = "./data/data-enemy" + setting + ".json";
		loadData(src).then((enemyDataList) =>
		{
			resolve(enemyDataList);
		});
	});
}

export function loadEnemyData(enemyIndex)
{
	return new Promise(resolve =>
	{
		var src = "./data/data-enemy" + setting + ".json";
		loadData(src).then((enemyDataList) =>
		{
			var enemyData = enemyDataList[enemyIndex];
			resolve(enemyData);
		});
	});
}

/*
function loadEnemyIMGData()
{
	return new Promise(resolve=> {
		var src="./data/data-enemy"+setting+".json";
		loadData(src).then(()=> {
			var enemyIMGData={};
			for (var key in enemyDataList)
			{
				if (enemyDataList.hasOwnProperty(key))
				{
					enemyIMGData[key] = enemyDataList[key].img;
				}
			}
			//var enemyIMGData=enemyDataList.map(data => {return {"name": data.name, "img": data.img}; });
			//resolve(enemyIMGData);
			resolve(enemyIMGData);
		});
	});
}

function loadEnemyDescData()
{
	return new Promise(resolve=> {
		var src="./data/data-enemy"+setting+".json";
		loadData(src).then(()=> {
			var enemyDescData=enemyDataList.map(data => {
				var rtn = {"name": data.name, "img": data.img};
				if('resist' in data) rtn["resist"] = data.resist;
				if('CRT' in data) rtn["CRT"] = data.CRT;
				return rtn;
			});
			resolve(enemyDescData);
		});
	});
}
*/

export function loadSkillDataList()
{
	return new Promise(resolve =>
	{
		var src = "./data/data-skill" + setting + ".json";
		loadData(src).then((enemySkillList) =>
		{
			resolve(enemySkillList);
		});
	});
}

export function getURLParameter(sParam)
{
	var sPageURL = window.location.search.substring(1);
	var sURLVariables = sPageURL.split('&');
	for (var i = 0; i < sURLVariables.length; i++)
	{
		var sParameterName = sURLVariables[i].split('=');
		if (sParameterName[0] === sParam) { return sParameterName[1]; }
	}
}

export function getAreaByStageTitle(str)
{
	var regex = /^[0-9a-zA-Z]+/;
	return str.match(regex)[0];
}

export function getIndexByStageTitle(str)
{
	var regex = /-[0-9]+/;
	return Number(str.match(regex)[0].slice(1));
}

export function getTypeByStageTitle(str)
{
	var regex = /[a-zA-Z]*$/;
	return str.match(regex)[0];
}

export function getIndexByStageGrid(grid)
{
	return grid[0];
}

export function getTypeByStageGrid(grid)
{
	var stageTypeTitle = ["B", "", "Ex"];
	return stageTypeTitle[grid[1]];
}