import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Button,
  Alert,
  TextInput,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import firebaseConfig from "../Servicios/Firebase";

// Inicializar Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export default function RecipesScreen() {
  const [recetas, setRecetas] = useState([]);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);

  // Nuevo: modal para confirmar eliminación
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
  const [recetaParaEliminar, setRecetaParaEliminar] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const obtenerRecetas = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "recetas"));
      const lista = [];
      querySnapshot.forEach((docu) => {
        lista.push({ id: docu.id, ...docu.data() });
      });
      console.log("Recetas obtenidas:", lista);
      setRecetas(lista);
    } catch (error) {
      console.error("Error al obtener recetas:", error);
      Alert.alert("Error", "No se pudieron cargar las recetas.");
    }
  };

  useEffect(() => {
    obtenerRecetas();
  }, []);

  // Abre el modal de confirmación (reemplaza el Alert)
  const confirmarEliminar = (receta) => {
    console.log("Solicitada confirmación para eliminar:", receta?.id);
    setRecetaParaEliminar(receta);
    setModalDeleteVisible(true);
  };

  // Ejecuta la eliminación (cuando el usuario confirma en el modal)
  const handleEliminarConfirmado = async () => {
    if (!recetaParaEliminar?.id) {
      Alert.alert("Error", "No se encontró la receta a eliminar.");
      setModalDeleteVisible(false);
      return;
    }

    setDeleting(true);
    try {
      console.log("Eliminando receta id:", recetaParaEliminar.id);
      await deleteDoc(doc(db, "recetas", recetaParaEliminar.id));

      // Actualiza el estado local inmediatamente
      setRecetas((prev) =>
        prev.filter((r) => r.id !== recetaParaEliminar.id)
      );

      setModalDeleteVisible(false);
      setRecetaParaEliminar(null);
      Alert.alert("🗑️ Eliminada", "La receta fue eliminada correctamente.");
    } catch (error) {
      console.error("Error al eliminar receta:", error);
      Alert.alert("❌ Error", "No se pudo eliminar la receta. Revisa permisos y conexión.");
    } finally {
      setDeleting(false);
    }
  };

  // Editar (igual que antes)
  const editarReceta = (receta) => {
    setRecetaSeleccionada({ ...receta });
    setModalEditVisible(true);
  };

  const guardarCambios = async () => {
    if (
      !recetaSeleccionada?.titulo ||
      !recetaSeleccionada?.ingredientes ||
      !recetaSeleccionada?.instrucciones
    ) {
      Alert.alert("Campos vacíos", "Completa todos los campos.");
      return;
    }

    try {
      await updateDoc(doc(db, "recetas", recetaSeleccionada.id), {
        titulo: recetaSeleccionada.titulo,
        ingredientes: recetaSeleccionada.ingredientes,
        instrucciones: recetaSeleccionada.instrucciones,
      });

      Alert.alert("✅ Actualizada", "La receta fue actualizada correctamente.");
      setModalEditVisible(false);
      obtenerRecetas();
    } catch (error) {
      console.error("Error al actualizar receta:", error);
      Alert.alert("❌ Error", "No se pudo actualizar la receta.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>📖 Recetas Guardadas</Text>

      {recetas.length === 0 ? (
        <Text style={styles.vacio}>No hay recetas guardadas aún.</Text>
      ) : (
        recetas.map((receta) => (
          <View key={receta.id} style={styles.card}>
            {receta.imagen ? (
              <Image source={{ uri: receta.imagen }} style={styles.imagen} />
            ) : null}

            <Text style={styles.nombre}>{receta.titulo}</Text>
            <Text style={styles.texto}>
              <Text style={{ fontWeight: "bold" }}>Ingredientes: </Text>
              {receta.ingredientes}
            </Text>
            <Text style={styles.texto}>
              <Text style={{ fontWeight: "bold" }}>Preparación: </Text>
              {receta.instrucciones}
            </Text>

            <View style={styles.botones}>
              <Button
                title="Editar"
                color="#4CAF50"
                onPress={() => editarReceta(receta)}
              />
              <Button
                title="Eliminar"
                color="red"
                onPress={() => confirmarEliminar(receta)}
              />
            </View>
          </View>
        ))
      )}

      {/* Modal editar */}
      <Modal visible={modalEditVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContenido}>
            <Text style={styles.modalTitulo}>✏️ Editar Receta</Text>

            <TextInput
              style={styles.input}
              placeholder="Título"
              value={recetaSeleccionada?.titulo}
              onChangeText={(text) =>
                setRecetaSeleccionada({ ...recetaSeleccionada, titulo: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Ingredientes"
              multiline
              value={recetaSeleccionada?.ingredientes}
              onChangeText={(text) =>
                setRecetaSeleccionada({ ...recetaSeleccionada, ingredientes: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Preparación"
              multiline
              value={recetaSeleccionada?.instrucciones}
              onChangeText={(text) =>
                setRecetaSeleccionada({ ...recetaSeleccionada, instrucciones: text })
              }
            />

            <View style={styles.botonesModal}>
              <Button title="Guardar" onPress={guardarCambios} color="#4CAF50" />
              <Button
                title="Cancelar"
                color="gray"
                onPress={() => setModalEditVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal confirmar eliminación */}
      <Modal visible={modalDeleteVisible} animationType="fade" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContenido}>
            <Text style={styles.modalTitulo}>Eliminar receta</Text>
            <Text style={{ marginBottom: 15, textAlign: "center" }}>
              ¿Deseas eliminar la receta{" "}
              <Text style={{ fontWeight: "bold" }}>
                {recetaParaEliminar?.titulo ?? ""}
              </Text>
              ?
            </Text>

            {deleting ? (
              <ActivityIndicator size="large" />
            ) : (
              <View style={styles.botonesModal}>
                <TouchableOpacity
                  style={[styles.btnModal, { backgroundColor: "#ddd" }]}
                  onPress={() => {
                    setModalDeleteVisible(false);
                    setRecetaParaEliminar(null);
                  }}
                >
                  <Text>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.btnModal, { backgroundColor: "#ff4d4f" }]}
                  onPress={handleEliminarConfirmado}
                >
                  <Text style={{ color: "white" }}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#fff",
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  vacio: {
    textAlign: "center",
    color: "gray",
    marginTop: 20,
  },
  card: {
    backgroundColor: "#fafafa",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  imagen: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  nombre: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  texto: {
    marginBottom: 5,
  },
  botones: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContenido: {
    width: "100%",
    maxWidth: 450,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  botonesModal: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  btnModal: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
});
