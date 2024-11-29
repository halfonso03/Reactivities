import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { Header, List } from 'semantic-ui-react';

interface Activity {
  id: number;
  title: string;
}

function App() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    async function get() {
      const data = await axios.get('http://localhost:5000/api/activities');

      setActivities(data.data);
    }
    get();
  }, []);

  return (
    <div>
      <Header as="h1" icon="users" content="Reactivities"></Header>
      <List>
        {activities &&
          activities.map((a: Activity) => (
            <List.Item key={a.title}>{a.title}</List.Item>
          ))}
      </List>
    </div>
  );
}

export default App;

// {ducks.map((d) => (
//   <DuckItem duck={d} key={d.name}></DuckItem>
// ))}
