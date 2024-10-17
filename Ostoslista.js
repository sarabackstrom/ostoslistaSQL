import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { Button, TextInput, Text, List } from 'react-native-paper';

export default function Ostoslista() {

  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [shoppinglist, setShoppinglist] = useState([]);
  const db = SQLite.openDatabaseSync('shoppinglistdb');

  const initialize = async () => {
    try {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS shoppinglist (id INTEGER PRIMARY KEY NOT NULL, product TEXT, amount INT);
      `);
      await updateList();
    } catch (error) {
      console.error('Could not open database', error);
    }
  }

  const saveProduct = async () => {
    try {
      await db.runAsync('INSERT INTO shoppinglist VALUES (?, ?, ?)', null, product, amount);
      await updateList();
    } catch (error) {
      console.error('Could not add product', error);
    }
  };

  const updateList = async () => {
    try {
      const list = await db.getAllAsync('SELECT * from shoppinglist');
      setShoppinglist(list);
    } catch (error) {
      console.error('Could not get products', error);
    }
  }

  const deleteProduct = async (id) => {
    console.log('deleteProduct')
    try {
      await db.runAsync('DELETE FROM shoppinglist WHERE id=?', id);
      await updateList();
    }
    catch (error) {
      console.error('Could not delete product', error);
    }
  }

  useEffect(() => { initialize() }, []);

  return (
    <View style={styles.container}>
      <View style ={styles.textInput}>
      <TextInput
        //style={{ width: '90%', marginBottom: 10 }}
        label="Product"
        value={product}
        onChangeText={text => setProduct(text)}
      />
      <TextInput
        //style={{ width: '90%', marginBottom: 10 }}
        label="Amount"
        onChangeText={amount => setAmount(amount)}
        value={amount}
      />
      </View>
      <Button mode="contained" icon="content-save" onPress={saveProduct} style = {styles.button}>Save</Button>
      <StatusBar style="auto" />

      <FlatList
        style={styles.list}
        data={shoppinglist}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <List.Item
            title={`${item.product} (${item.amount})`}
            right={props => (
              <TouchableOpacity onPress={() => deleteProduct(item.id)}>
                <List.Icon {...props} icon="delete" />
              </TouchableOpacity>
            )}
          />
        )}
      />
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 80,
  },
  list: {
    flex: 1,
    width: '100%',
  },
  textInput: {
    width: '90%',
    marginBottom: 30,
  },
});
