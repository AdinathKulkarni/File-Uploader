#include <iostream>
#include<unordered_map>
#include<vector>
#include<stack>
using namespace std;

unordered_map<int, vector<int>> adjList;

class Graph{
  public:
  
  void addEdge(int u, int v, bool direction){
    if(direction){
      adjList[u].push_back(v);
    }
    else {
      adjList[u].push_back(v);
      adjList[v].push_back(u);
    }
  }

  void printAdjList(int n){
      cout<<"Printing Adjacency List"<<endl;
    for(int i = 0; i < n; i++){
      cout << i << ":" << " ";
      for(auto j : adjList[i]){
        cout<< j << " ";
      }
      cout<<endl;
    }

  }

  void dfs(unordered_map<int, vector<int>> &adjList, unordered_map<int, bool> &visited, int src, stack<int> &topoOrder){
    visited[src] = true;

    for(auto nbr : adjList[src]){
      if(!visited[nbr]){
        dfs(adjList, visited, nbr, topoOrder);
      }
    }
    topoOrder.push(src);
  }

  void dfs2(unordered_map<int, vector<int>> &revAdjList, unordered_map<int, bool> &visited, int src){
    visited[src] = true;

    for(auto nbr : revAdjList[src]){
      if(!visited[nbr]){
        dfs2(revAdjList, visited, nbr);
      }
    }
    // topoOrder.push(src);
  }

  int kosaRajuAlgo(int n){

    //step 1 : get topological order
    unordered_map<int, bool> visited;
    stack<int> topoOrder;
    for(int i = 0; i < n; i++){
      if(!visited[i]){
        dfs(adjList, visited, i,topoOrder);
      }
    }
    //now my dfs traversal is ready

    //step  2 : reverse all the edges
    unordered_map<int, vector<int> > revAdjList;
    for (auto i : adjList){
        /*i.first = int , 
          i.second = vector
        */
      for(auto j : i.second){
        int u = i.first; //int 
        int v = j; //vector

        /*
          normal adjList : u --> v
          reverse adjList : u <--v 
        */

        revAdjList[v].push_back(u); // reverse connection
      }
    }

    int count = 0;
    visited.clear(); // reset the map
    //step 3 : dfs traversal again
    while(!topoOrder.empty()){
      int src = topoOrder.top(); topoOrder.pop();

      if(!visited[src]){
        dfs2(revAdjList, visited, src); // for thsi algo send revAdjList
        count++;
      }

    }
    return count;
  }

};

int main() {
  Graph g;
  g.addEdge(0,3,1);
  g.addEdge(3,2,1);
  g.addEdge(2,1,1);
  g.addEdge(1,0,1);
  g.addEdge(2,4,1);
  g.addEdge(4,5,1);
  g.addEdge(5,6,1);
  g.addEdge(6,4,1);
  g.addEdge(6,7,1);

  int n = 8;
  g.printAdjList(n);

  int scc = g.kosaRajuAlgo(n);
  cout << "Strongly Connected Components : "<< scc << endl;

  return 0;
}