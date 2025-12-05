export const validarCorreo = (correo) =>
  /@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/.test(correo);

export const validarPassword = (pass) =>
  pass.length >= 4 && pass.length <= 10;
