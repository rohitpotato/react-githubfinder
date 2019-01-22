import React, { Component } from 'react';

class App extends Component {

  constructor() {

      super();

      this.state = {

        clientId: 'YOUR CLIENT ID',
        clientSecret: 'YOUR CLIENT SECRET',
        count: 18,
        sort: 'created: asc',
        userProfile: null,
        repos: null,
        showRepos: false,
        notFound: false
      };
  }

  handleInputChange = (e) => {

      const user = e.target.value;

      fetch(`https://api.github.com/users/${user}?client_id=${this.state.clientId}&client_secret=${this.state.clientSecret}`).
      then((res) => res.json()).
      then((data) => {

      		if(data.message === 'Not Found') {

      				this.setState({ notFound: true });
      				console.log('Not found!');

      		} else {

      			this.setState({ userProfile: data, notFound: false });

      		}
      }).catch((e) => {

      		console.log(e);
      });

  };

  repoHandler = (e) => {

  		if(this.state.userProfile) {
  			const repo_url = this.state.userProfile.repos_url;
  			fetch(`${repo_url}?per_page=${this.state.count}&sort=${this.state.sort}`).
  				then((res) => res.json()).
  					then((data) => this.setState({ repos: data, showRepos: true })).
  					catch((e) => console.log(e));
  				
  		}
  		
  };

  isObjectEmpty = (obj) => {

      for (var key in obj) {

          if(obj.hasOwnProperty(key)) {

              return false;
          }

          return true;
      }
  };

  render() {

  	let latestRepos;

  	if(this.state.repos && this.state.showRepos) {

  			if(this.state.repos.length > 0) {

  		latestRepos = this.state.repos.map((repo) => {

  			return (
  						<div key={repo.name} id="repos">
	    				<div className="card card-body mb-2">
	    					<div className="row">
	    						<div className="col-md-6">
	    							<h5><a href={repo.url} target="_blank" >{repo.name}</a></h5>
    							</div>
    						<div className="col-md-6">  
			    				<span className="badge badge-primary">Stars: {repo.stargazers_count}</span>
			    				<span className="badge badge-secondary">Watchers: {repo.watchers_count}</span>
			    				<span className="badge badge-success">Forks: {repo.forks_count}</span>
			    				<br />
			    				<br />
			    				<p><small>{repo.description}</small></p>
    						</div>
    						</div>
    					</div>
    				</div>
  			);

  		});

  		}	else {

  			latestRepos = `<h1>No Repos exists for this user</h1>`;
  		}
  	}

    return (

      <div className="App">
      <div>
      <nav className="navbar navbar-dark bg-primary mb-3">
      <div className="container">
      <a href="#" className="navbar-brand">GitHub Finder</a>
      <a href="github.com/react-githubfinder" className="navbar-brand">Repo Link	</a>
      </div>
      </nav>
      {this.state.notFound && 
      	<div class="alert alert-dismissible alert-danger">
			<button type="button" class="close" data-dismiss="alert">&times;</button>
			<h4 class="alert-heading">User not Found!</h4>
	   </div>}
  						
      <div className="container searchContainer">
      <div className="search card card-body">
      <h1>Search GitHub Users</h1>
      <p className="lead">Enter a username to fetch a user profile and repos</p>
      <input type="text" id="searchUser" className="form-control" placeholder="GitHub Username..." onChange={this.handleInputChange} />
      </div>
      <br />
      <div id="profile">
   		{ this.state.userProfile &&      
   			<div className="card card-body mb-3">
          <div className="row">
            <div className="col-md-3">
              <img className="img-fluid mb-2" src={this.state.userProfile.avatar_url} />
                <a href={`https://github.com/${this.state.userProfile.login}`} target="_blank" className="btn btn-primary btn-block mb-4">View Profile</a>
             </div>
            <div className="col-md-9">
              <span className="badge badge-primary">Public Repos: {this.state.userProfile.public_repos}</span>
              <span className="badge badge-secondary">Public Gists: {this.state.userProfile.public_gists}</span>
              <span className="badge badge-success">Followers: {this.state.userProfile.followers}</span>
              <span className="badge badge-info">Following: {this.state.userProfile.following}</span>
              <br /><br />
              <ul className="list-group">
              	<li className="list-group-item">Username: {this.state.userProfile.login}</li>
                <li className="list-group-item">Company: {this.state.userProfile.company}</li>
                <li className="list-group-item">Website/Blog: {this.state.userProfile.blog}</li>
                <li className="list-group-item">Location: {this.state.userProfile.location}</li>
                <li className="list-group-item">Member Since: {this.state.userProfile.created_at}</li>
              </ul>
            </div>
        </div>
       </div> }
       <br />
       <br />
       { this.state.userProfile && <button type="button" className="btn btn-success" onClick={this.repoHandler}>Show repos</button> }
       <br />
       <br />
      { this.state.userProfile && <h3 className="page-heading mb-3">Latest Repos</h3> }
    	{latestRepos}
      </div>
      </div>
        <footer className="mt-5 p-3 text-center bg-light">
            GitHub Finder ©
        </footer>
      </div>

  </div>
    );
  }
}

export default App;
