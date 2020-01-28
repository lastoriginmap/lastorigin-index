import React from "react";
import * as Common from "./common.js";

const Hangul = require("hangul-js");

class NavBar extends React.Component
{
  state = {
    showSearchResult: false,
    showIndexResult: false,
    SearchList: null,
    ResultListStyle: null,
    IndexResultListStyle: null,
    ContainerStyle: null
  };

  NameList = null;
  isResultClosing = false;
  isSearchResultClosed = true;

  updateSearchList = (revstate, str) =>
  {
    revstate.showSearchResult = true;
    revstate.showIndexResult = false;

    if (str.length > 0)
    {
      let searcher = new Hangul.Searcher(str);

      let searchlist = Object.keys(this.NameList)
        .reduce((acc, curr) =>
        {
          if (searcher.search(curr) !== -1)
          {
            acc.push([curr, searcher.search(curr)]);
          }
          return acc;
        }, [])
        .sort((a, b) =>
        {
          if (a[1] < b[1]) return -1;
          if (a[1] > b[1]) return 1;
          return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0;
        })
        .map(elem => elem[0]);
      revstate.SearchList = searchlist;
    }
    else
    {
      revstate.SearchList = Object.keys(this.NameList);
    }
  };

  openResultList = revstate =>
  {
    console.log("openResultList")
    revstate.showSearchResult = true;
    if (!matchMedia("(min-width: 1100px)").matches)
    {
      let maxHeight = 6250 + "px";
      revstate.ResultListStyle = { ...this.state.ResultListStyle, "maxHeight": maxHeight };
    }
  }

  closeResultList = revstate =>
  {
    console.log("closeResultList")
    revstate.showSearchResult = false;
    if (!matchMedia("(min-width: 1100px)").matches)
    {
      revstate.ResultListStyle = { ...this.state.ResultListStyle, "maxHeight": null };
      this.isResultClosing = true;
    }
  }

  openIndexResultList = (revstate, index) =>
  {
    console.log("openIndexResultList")
    revstate.showIndexResult = index;
    if (matchMedia("(min-width: 1100px)").matches)
    {
      let maxWidth = "230px";
      let opacity = 1;
      revstate.IndexResultListStyle = { ...this.state.IndexResultListStyle, "maxWidth": maxWidth, "opacity": opacity };
    }
    else
    {
      let maxHeight = document.querySelector("#" + index).scrollHeight + "px";
      revstate.IndexResultListStyle = { ...this.state.IndexResultListStyle, "maxHeight": maxHeight };
    }
  };

  closeIndexResultList = revstate =>
  {
    console.log("closeIndexResultList")
    revstate.showIndexResult = false;
    if (matchMedia("(min-width: 1100px)").matches)
    {
      revstate.IndexResultListStyle = { ...this.state.IndexResultListStyle, "maxWidth": null, "opacity": null };
    }
    else
    {
      revstate.IndexResultListStyle = { ...this.state.IndexResultListStyle, "maxHeight": null };
    }
  };

  handleResultsToggleClick = () =>
  {
    document.querySelector(".navbar-input").value = null;
    let newstate = {};
    if (this.state.showSearchResult)
    {
      this.closeResultList(newstate);
    }
    else
    {
      this.openResultList(newstate);
    }
    this.setState(prevstate => ({ ...prevstate, ...newstate }));
  }

  handleInputFocus = () =>
  {
    console.log("handleInputFocus")
    let newstate = {};
    this.openResultList(newstate);
    this.setState(prevstate => ({ ...prevstate, ...newstate }));
  }

  handleInputChange = e =>
  {
    console.log("handleInputChange")
    let newstate = {};
    this.updateSearchList(newstate, e.target.value);
    this.closeIndexResultList(newstate);
    window.scrollTo(0, 0);
    this.setState(prevstate => ({ ...prevstate, ...newstate }));
  }

  handleResultsClick = (name, index) =>
  {
    let newstate = {};
    if (this.state.showIndexResult)
    {
      this.closeIndexResultList(newstate);
    }
    if (index !== this.state.showIndexResult)
    {
      this.openIndexResultList(newstate, index);
    }
    this.setState(prevstate => ({ ...prevstate, ...newstate }));
  };

  handleIndexResultsClick = (index, typeindex) =>
  {
    this.props.onEnemyChange(index);
    let newstate = {};
    this.closeResultList(newstate);
    document.querySelector(".navbar-input").value = null;
    if (matchMedia("(min-width: 1100px)").matches)
    {
      this.openIndexResultList(newstate, this.state.showIndexResult);
      newstate.SearchList = Object.keys(this.NameList);
    }
    this.isResultClosing = true;
    this.setState(prevstate => ({ ...prevstate, ...newstate }));
  };

  scrollToIndex = typeindex => 
  {
    window.scrollTo(0, Object.values(this.NameList).map(elem => elem[0]).indexOf(typeindex) * 50);
  }

  resetSearchResult = () =>
  {
    console.log("resetSearchResult")
    if (!matchMedia("(min-width: 1100px)").matches && this.isResultClosing)
    {
      this.isResultClosing = false;
      let newstate = {};
      this.closeIndexResultList(newstate);
      this.setState(prevstate => ({
        ...prevstate,
        ...newstate,
        "showSearchResult": false,
        "showIndexResult": false,
        "SearchList": Object.keys(this.NameList)
      }));
    }
  }

  componentDidMount()
  {
    (async () =>
    {
      let enemyDataList = await Common.loadEnemyDataList();
      this.NameList = Object.keys(enemyDataList).reduce((acc, curr) =>
      {
        if (!Object.keys(acc).includes(enemyDataList[curr].name))
        {
          acc[enemyDataList[curr].name] = [curr];
        }
        else
        {
          acc[enemyDataList[curr].name].push(curr);
        }
        return acc;
      }, {});
      this.setState(prevstate => ({
        ...prevstate,
        "showSearchResult": false,
        "showIndexResult": false,
        "SearchList": Object.keys(this.NameList)
      }));
    })();
  }

  componentDidUpdate()
  {
    if (matchMedia("(min-width: 1100px)").matches)
    {
      if (this.isResultClosing)
      {
        console.log("this.state.showIndexResult: " + this.state.showIndexResult)
        this.scrollToIndex(this.state.showIndexResult);
        this.isResultClosing = false;
      }
    }
  }

  render()
  {
    console.log("renderNavBar")
    return (
      <div className="nav">
        <div className="navbar">
          <div className="navbar-button" onClick={this.handleResultsToggleClick}>
            <i className="material-icons material-icons-list" style={this.state.showSearchResult ? { opacity: 0 } : null}>list</i>
            <i className="material-icons material-icons-close" style={this.state.showSearchResult ? null : { opacity: 0 }}>close</i>
          </div>
          <input type="text" className="navbar-input" placeholder="이름을 입력하세요." onFocus={this.handleInputFocus} onChange={this.handleInputChange}></input>
          <div className="navbar-input-icon">
            <i className="material-icons">search</i>
          </div>
        </div>
        <List
          SearchList={this.state.SearchList}
          NameList={this.NameList}
          handleResultsClick={this.handleResultsClick}
          handleIndexResultsClick={this.handleIndexResultsClick}
          resetSearchResult={this.resetSearchResult}
          ResultListStyle={this.state.ResultListStyle}
          showIndexResult={this.state.showIndexResult}
          IndexResultListStyle={this.state.IndexResultListStyle}
        />
      </div>
    );
  }
}

class List extends React.Component
{
  render()
  {
    let searchresults = this.props.SearchList == null ? [] :
      this.props.SearchList.reduce((acc, curr) =>
      {
        let name = curr;
        let indexes = this.props.NameList[curr];
        let typeindex = indexes[0];
        acc.value.push(
          <div className="list-result-container" key={typeindex + "container"} id={typeindex + "container"}>
            <li className="list-result" key={typeindex} onClick={() => { this.props.handleResultsClick(name, typeindex); }}>{name}</li>
            <ul className="list list-index" id={typeindex} key={typeindex + "indexlist"}
              style={typeindex === this.props.showIndexResult ? this.props.IndexResultListStyle : null
              }>
              {indexes.reduce((indexacc, indexcurr) =>
              {
                indexacc.index++;
                indexacc.value.push(<li className="list-result list-indexresult" key={indexcurr} onClick={() => { this.props.handleIndexResultsClick(indexcurr, typeindex); }}>{name + " " + (indexacc.index)}</li>);
                return indexacc;
              }, { index: 0, value: [] }).value}
            </ul>
          </div>
        );
        acc.index++;
        return acc;
      }, { value: [], index: 0 }).value;

    return (
      <ul className="list" style={this.props.ResultListStyle} onTransitionEnd={this.props.resetSearchResult}>
        {searchresults}
      </ul>
    );
  }
}

export default NavBar;
